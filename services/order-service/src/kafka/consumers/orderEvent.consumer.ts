import { createKafkaConsumer } from "../kafka.consumer";
import { parseOrderEvent } from "../events/orderEvent.parser";

import { OrderCreatedHandler } from "../handlers/orderCreated.handler";
import { OrderStatusChangedHandler } from "../handlers/orderStatusChanged.handler";

import {
  processedEventRepository,
  orderProjectionRepository,
} from "../../utils/helpers/container";

const ORDER_TOPIC =
  process.env.KAFKA_ORDER_TOPIC || "orders.events";

const assertNever = (value: never): never => {
  throw new Error(
    `Unsupported order event type: ${String(value)}`
  );
};

export const startOrderEventConsumer = async (): Promise<void> => {
  const consumer = await createKafkaConsumer();

  const orderCreatedHandler = new OrderCreatedHandler(
    processedEventRepository,
    orderProjectionRepository
  );

  const orderStatusChangedHandler =
    new OrderStatusChangedHandler(
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
        const event = parseOrderEvent(value);

        console.log("📨 Order event received:", {
          topic,
          partition,
          offset: message.offset,
          eventId: event.eventId,
          eventType: event.eventType,
        });

        // 1. Process the event.
        //    This includes the PostgreSQL transaction.
        switch (event.eventType) {
          case "OrderCreated":
            await orderCreatedHandler.handle(event);
            break;

          case "OrderStatusChanged":
            await orderStatusChangedHandler.handle(event);
            break;

          default:
            assertNever(event);
        }

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