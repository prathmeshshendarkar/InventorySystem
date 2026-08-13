import { createKafkaConsumer } from "../kafka.consumer";
import { parseOrderCreatedEvent } from "../events/orderEvent.parser";
import { OrderCreatedHandler } from "../handlers/orderCreated.handler";
import { processedEventRepository } from "../../utils/helpers/container";

const ORDER_TOPIC =
  process.env.KAFKA_ORDER_TOPIC || "orders.events";

export const startOrderEventConsumer = async (): Promise<void> => {
  const consumer = await createKafkaConsumer();

  const orderCreatedHandler = new OrderCreatedHandler(processedEventRepository);

  await consumer.subscribe({
    topic: ORDER_TOPIC,
    fromBeginning: false,
  });

  console.log(
    `📥 Kafka consumer subscribed to ${ORDER_TOPIC}`
  );

  await consumer.run({
    eachMessage: async ({
      topic,
      partition,
      message,
    }) => {
      const value = message.value?.toString();

      if (!value) {
        console.warn("⚠️ Kafka message has no value");
        return;
      }

      try {
        const event = parseOrderCreatedEvent(value);

        console.log("📨 OrderCreated event received:", {
          topic,
          partition,
          offset: message.offset,
          eventId: event.eventId,
        });

        await orderCreatedHandler.handle(event);
      } catch (error) {
        console.error(
          "❌ Failed to process Kafka event:",
          error
        );
      }
    },
  });
};