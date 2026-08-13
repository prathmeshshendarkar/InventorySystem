import { Transaction } from "sequelize";
import {
  ProcessedEvent,
  ProcessedEventStatus,
} from "../../models/ProcessedEvent";

export class ProcessedEventRepository {
  async tryStartProcessing(
    eventId: string,
    eventType: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const [processedEvent, created] =
      await ProcessedEvent.findOrCreate({
        where: {
          eventId,
        },
        defaults: {
          eventId,
          eventType,
          status: "PROCESSING",
          processedAt: null,
        },
        transaction,
      });

    if (created) {
      return true;
    }

    return processedEvent.status !== "COMPLETED";
  }

  async markCompleted(
    eventId: string,
    transaction?: Transaction
  ): Promise<void> {
    await ProcessedEvent.update(
      {
        status: "COMPLETED",
        processedAt: new Date(),
      },
      {
        where: {
          eventId,
        },
        transaction,
      }
    );
  }
}