import { Consumer } from "kafkajs";
import { kafka } from "./kafka.client";

export const createKafkaConsumer = async (): Promise<Consumer> => {
  const consumer = kafka.consumer({
    groupId: "order-service-consumer",
  });

  await consumer.connect();

  console.log("✅ Kafka consumer connected");

  return consumer;
};