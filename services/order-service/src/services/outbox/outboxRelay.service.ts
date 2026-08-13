import { sequelize } from "../../models/sequelize";
import { OutboxRepository, OutboxPublisher } from "../../repositories";
import { OUTBOX_MAX_ATTEMPTS } from "../../constants";

export class OutboxRelayService {
  private isRunning = false;

  constructor(
    private readonly outboxRepository: OutboxRepository,
    private readonly publisher: OutboxPublisher
  ) {}

  async processBatch(limit = 10): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      const events = await sequelize.transaction(
        async (transaction) => {
          return this.outboxRepository.claimPendingEvents(
            limit,
            transaction
          );
        }
      );

      if (events.length === 0) {
        return;
      }

      console.log(
        `📦 Claimed ${events.length} outbox event(s)`
      );

      for (const event of events) {
        try {
          await this.publisher.publish(event);

          await sequelize.transaction(async (transaction) => {
            await this.outboxRepository.markPublished(
              event.id,
              transaction
            );
          });

          console.log(
            `✅ Outbox event published: ${event.id}`
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : String(error);

          console.error(
            `❌ Failed to publish outbox event ${event.id}:`,
            errorMessage
          );

          await sequelize.transaction(async (transaction) => {
            if (event.attempts >= OUTBOX_MAX_ATTEMPTS) {
              await this.outboxRepository.markFailed(
                event.id,
                errorMessage,
                transaction
              );

              console.error(
                `🚨 Outbox event permanently failed after ${event.attempts} attempts: ${event.id}`
              );
            } else {
              await this.outboxRepository.markPending(
                event.id,
                errorMessage,
                transaction
              );
            }
          });
        }
      }
    } finally {
      this.isRunning = false;
    }
  }
}