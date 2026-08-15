import { createKafkaConsumer } from "../kafka.consumer";
import { parseOrderCreatedEvent } from "../events/orderEvent.parser";
import { OrderCreatedHandler } from "../handlers/orderCreated.handler";
import {
  processedEventRepository,
  orderProjectionRepository,
} from "../../utils/helpers/container";

const ORDER_TOPIC =
  process.env.KAFKA_ORDER_TOPIC || "orders.events";

export const startOrderEventConsumer = async (): Promise<void> => {
  const consumer = await createKafkaConsumer();

  const orderCreatedHandler = new OrderCreatedHandler(
    processedEventRepository,
    orderProjectionRepository
  );

  await consumer.subscribe({
    topic: ORDER_TOPIC,
    fromBeginning: false,
  });

  console.log(
    `📥 Kafka consumer subscribed to ${ORDER_TOPIC}`
  );

  await consumer.run({
  autoCommit: false,

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

      // 1. Process the event.
      //    This includes the PostgreSQL transaction.
      await orderCreatedHandler.handle(event);

      // 2. Only after the DB transaction succeeds,
      //    commit the NEXT Kafka offset.
      const nextOffset = (
        BigInt(message.offset) + 1n
      ).toString();

      await consumer.commitOffsets([
        {
          topic,
          partition,
          offset: nextOffset,
        },
      ]);

      console.log(
        `📌 Kafka offset committed: ${nextOffset}`
      );
    } catch (error) {
      console.error(
        "❌ Failed to process Kafka event:",
        error
      );

      // DO NOT commit the offset.
      //
      // Kafka will continue to consider this message
      // uncommitted, allowing it to be retried.
      throw error;
    }
  },
});
};