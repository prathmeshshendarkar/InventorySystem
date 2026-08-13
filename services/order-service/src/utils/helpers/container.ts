import { OUTBOX_POLL_INTERVAL_MS } from "../../constants";
import {
  OrderRepository,
  OrderItemRepository,
  OutboxRepository,
  ConsoleOutboxPublisher,
} from "../../repositories";

import { OrderService } from "../../services/createOrder/createOrder.service";
import { OutboxRelayService } from "../../services/outbox/outboxRelay.service";
import { OutboxWorker } from "../../services/outbox/outboxWorker";

const orderRepository = new OrderRepository();
const orderItemRepository = new OrderItemRepository();

const outboxRepository = new OutboxRepository();
const outboxPublisher = new ConsoleOutboxPublisher();
const outboxRelayService = new OutboxRelayService(
  outboxRepository,
  outboxPublisher
);

export const outboxWorker = new OutboxWorker(
  outboxRelayService,
  OUTBOX_POLL_INTERVAL_MS
);

export const orderService = new OrderService(
  orderRepository,
  orderItemRepository,
  outboxRepository
);