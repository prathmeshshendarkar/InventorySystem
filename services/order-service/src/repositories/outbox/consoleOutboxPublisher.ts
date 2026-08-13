import { OutboxEvent } from "../../models";
import { OutboxPublisher } from "./publisher";

export class ConsoleOutboxPublisher implements OutboxPublisher {
  async publish(event: OutboxEvent): Promise<void> {
    throw new Error("Simulated Kafka failure");
    
    console.log("Publishing outbox event:");

    console.log(
      JSON.stringify(
        {
          eventId: event.id,
          eventType: event.eventType,
          aggregateType: event.aggregateType,
          aggregateId: event.aggregateId,
          payload: event.payload,
        },
        null,
        2
      )
    );
  }
}