import { sequelize } from "../../models";
import { OrderStatusChangedEvent } from "../events/orderStatusChanged.event";
import { ProcessedEventRepository } from "../../repositories/processed_events/processedEvent.repository";
import { OrderProjectionRepository } from "../../repositories/order_projections/orderProjection.repository";

export class OrderStatusChangedHandler {
  constructor(
    private readonly processedEventRepository: ProcessedEventRepository,
    private readonly orderProjectionRepository: OrderProjectionRepository
  ) {}

  async handle(event: OrderStatusChangedEvent): Promise<void> {
    await sequelize.transaction(async (transaction) => {
      const shouldProcess =
        await this.processedEventRepository.tryStartProcessing(
          event.eventId,
          event.eventType,
          transaction
        );

      if (!shouldProcess) {
        console.log(
          `⏭️ Event already processed: ${event.eventId}`
        );

        return;
      }

      console.log(
        "⚙️ Processing OrderStatusChanged event:",
        {
          eventId: event.eventId,
          orderId: event.payload.orderId,
          previousStatus: event.payload.previousStatus,
          newStatus: event.payload.newStatus,
        }
      );

      const [affectedCount] =
        await this.orderProjectionRepository.updateStatus(
          event.payload.orderId,
          event.payload.newStatus,
          transaction
        );

      if (affectedCount === 0) {
        throw new Error(
          `Order projection not found: ${event.payload.orderId}`
        );
      }

      console.log(
        `📦 Order projection status updated: ${event.payload.orderId} → ${event.payload.newStatus}`
      );

      await this.processedEventRepository.markCompleted(
        event.eventId,
        transaction
      );

      console.log(
        `✅ Event processing completed: ${event.eventId}`
      );
    });
  }
}