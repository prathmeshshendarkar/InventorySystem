import { Kafka, Producer } from "kafkajs";

import { OutboxEvent } from "../../models";
import { OutboxPublisher } from "../../repositories";
import { kafkaConfig } from "../../config/kafka";

export class KafkaOutboxPublisher implements OutboxPublisher {
  private readonly producer: Producer;

  private connected = false;

  constructor() {
    const kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
    });

    this.producer = kafka.producer();
  }

  private async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    await this.producer.connect();

    this.connected = true;

    console.log(
      `✅ Kafka producer connected to ${kafkaConfig.brokers.join(", ")}`
    );
  }

  async publish(event: OutboxEvent): Promise<void> {
    await this.connect();

    await this.producer.send({
      topic: kafkaConfig.topic,

      messages: [
        {
          key: event.aggregateId,

          value: JSON.stringify({
            eventId: event.id,
            eventType: event.eventType,
            aggregateType: event.aggregateType,
            aggregateId: event.aggregateId,
            payload: event.payload,
          }),
        },
      ],
    });

    console.log(
      `📤 Kafka event published: ${event.id}`
    );
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    await this.producer.disconnect();

    this.connected = false;

    console.log("Kafka producer disconnected");
  }
}