import { OutboxEvent } from "../../models";

export interface OutboxPublisher {
  publish(event: OutboxEvent): Promise<void>;
}