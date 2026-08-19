import {
  OrderRepository,
  OrderItemRepository,
  OutboxRepository,
  ProcessedEventRepository,
  OrderProjectionRepository,
} from "../../repositories";

import { OrderService } from "../../services/createOrder/createOrder.service";
import { OutboxRelayService } from "../../services/outbox/outboxRelay.service";
import { OutboxWorker } from "../../services/outbox/outboxWorker";
import { KafkaOutboxPublisher } from "../../services/outbox/kafkaOutboxPublisher";
import { OrderQueryService } from "../../services/getOrder/getOrder.service";

const orderRepository = new OrderRepository();
const orderItemRepository = new OrderItemRepository();
const outboxRepository = new OutboxRepository();
const outboxPublisher = new KafkaOutboxPublisher();
const processedEventRepository = new ProcessedEventRepository();
const orderProjectionRepository = new OrderProjectionRepository();
const orderQueryService = new OrderQueryService(
  orderProjectionRepository
);

const outboxRelayService = new OutboxRelayService(
  outboxRepository,
  outboxPublisher
);

export const outboxWorker = new OutboxWorker(
  outboxRelayService,
  2000
);

export const orderService = new OrderService(
  orderRepository,
  orderItemRepository,
  outboxRepository
);

export {
  outboxPublisher,
  processedEventRepository,
  orderProjectionRepository,
  orderQueryService,
};