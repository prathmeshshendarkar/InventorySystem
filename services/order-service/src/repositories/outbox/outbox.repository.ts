import { Op, Transaction } from "sequelize";
import {
  OutboxEvent,
  OutboxEventStatus,
} from "../../models";
import { OUTBOX_STALE_PROCESSING_MS } from "../../constants";

export interface CreateOutboxEventInput {
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: Record<string, unknown>;
}

export class OutboxRepository {
  async create(
    data: CreateOutboxEventInput,
    transaction: Transaction
  ): Promise<OutboxEvent> {
    return OutboxEvent.create(
      {
        aggregateType: data.aggregateType,
        aggregateId: data.aggregateId,
        eventType: data.eventType,
        payload: data.payload,
        status: OutboxEventStatus.PENDING,
      },
      {
        transaction,
      }
    );
  }

  async claimPendingEvents(
    limit: number,
    transaction: Transaction
  ): Promise<OutboxEvent[]> {
    const staleBefore = new Date(
      Date.now() - OUTBOX_STALE_PROCESSING_MS
    );

    const events = await OutboxEvent.findAll({
      where: {
        [Op.or]: [
          {
            status: OutboxEventStatus.PENDING,
          },
          {
            status: OutboxEventStatus.PROCESSING,
            processingAt: {
              [Op.lte]: staleBefore,
            },
          },
        ],
      },

      order: [["createdAt", "ASC"]],

      limit,

      transaction,

      lock: transaction.LOCK.UPDATE,

      skipLocked: true,
    });

    if (events.length === 0) {
      return [];
    }

    const processingAt = new Date();

    await Promise.all(
      events.map((event) =>
        event.update(
          {
            status: OutboxEventStatus.PROCESSING,
            processingAt,
            attempts: event.attempts + 1,
          },
          {
            transaction,
          }
        )
      )
    );

    return events;
  }

  async markPublished(
    eventId: string,
    transaction: Transaction
  ): Promise<void> {
    await OutboxEvent.update(
      {
        status: OutboxEventStatus.PUBLISHED,
        processedAt: new Date(),
        processingAt: null,
        lastError: null,
      },
      {
        where: {
          id: eventId,
        },
        transaction,
      }
    );
  }

  async markPending(
    eventId: string,
    error: string,
    transaction: Transaction
  ): Promise<void> {
    await OutboxEvent.update(
      {
        status: OutboxEventStatus.PENDING,
        lastError: error,
        processingAt: null,
      },
      {
        where: {
          id: eventId,
        },
        transaction,
      }
    );
  }

  async markFailed(
    eventId: string,
    error: string,
    transaction: Transaction
  ): Promise<void> {
    await OutboxEvent.update(
      {
        status: OutboxEventStatus.FAILED,
        lastError: error,
        processingAt: null,
      },
      {
        where: {
          id: eventId,
        },
        transaction,
      }
    );
  }
}