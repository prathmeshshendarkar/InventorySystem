import {
  OrderRepository,
  OrderItemRepository,
} from "../../repositories";

import { OrderService } from "../../services/createOrder/createOrder.service";

const orderRepository = new OrderRepository();
const orderItemRepository = new OrderItemRepository();

export const orderService = new OrderService(
  orderRepository,
  orderItemRepository
);