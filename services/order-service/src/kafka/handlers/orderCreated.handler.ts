import { sequelize } from "../../models";
import { OrderCreatedEvent } from "../events/orderCreated.event";
import { ProcessedEventRepository } from "../../repositories/processed_events/processedEvent.repository";
import { OrderProjectionRepository } from "../../repositories/order_projections/orderProjection.repository";

export class OrderCreatedHandler {
  constructor(
    private readonly processedEventRepository: ProcessedEventRepository,
    private readonly orderProjectionRepository: OrderProjectionRepository
  ) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
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
        "⚙️ Processing OrderCreated event:",
        {
          eventId: event.eventId,
          orderId: event.payload.orderId,
          userId: event.payload.userId,
          totalAmount: event.payload.totalAmount,
          currency: event.payload.currency,
        }
      );

      await this.orderProjectionRepository.create(
        {
          orderId: event.payload.orderId,
          userId: event.payload.userId,
          totalAmount: event.payload.totalAmount,
          currency: event.payload.currency,
          status: event.payload.status,
        },
        transaction
      );

      console.log(
        `📦 Order projection created: ${event.payload.orderId}`
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