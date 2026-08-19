import { OrderStatus } from "../../models";

export interface OrderStatusChangedPayload {
  orderId: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
}

export interface OrderStatusChangedEvent {
  eventId: string;
  eventType: "OrderStatusChanged";
  aggregateType: "Order";
  aggregateId: string;
  payload: OrderStatusChangedPayload;
}