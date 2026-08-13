import { Kafka } from "kafkajs";

export const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID ?? "order-service",

  brokers: (
    process.env.KAFKA_BROKERS ?? "localhost:9092"
  ).split(","),

  topic:
    process.env.KAFKA_ORDER_TOPIC ?? "orders.events",
};