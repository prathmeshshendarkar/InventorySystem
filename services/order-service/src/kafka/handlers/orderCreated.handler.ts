import { OrderCreatedEvent } from "../events/orderCreated.event";
import { ProcessedEventRepository } from "../../repositories/processed_events/processedEvent.repository";

export class OrderCreatedHandler {
  constructor(
    private readonly processedEventRepository: ProcessedEventRepository
  ) {}

  async handle(
    event: OrderCreatedEvent
  ): Promise<void> {
    const shouldProcess =
      await this.processedEventRepository.tryStartProcessing(
        event.eventId,
        event.eventType
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

    // Business logic will eventually go here.

    await this.processedEventRepository.markCompleted(
      event.eventId
    );

    console.log(
      `✅ Event processing completed: ${event.eventId}`
    );
  }

  async testDuplicate(event: OrderCreatedEvent): Promise<void> {
    console.log("\n🧪 Testing duplicate event...\n");

    console.log("➡️ First attempt");
    await this.handle(event);

    console.log("\n➡️ Second attempt");
    await this.handle(event);

    console.log("\n🧪 Duplicate test finished\n");
    }
}