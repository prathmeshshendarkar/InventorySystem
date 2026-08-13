export interface OrderCreatedItem {
  orderId: string;
  quantity: number;
  productId: string;
  unitPrice: string;
}

export interface OrderCreatedPayload {
  items: OrderCreatedItem[];
  status: string;
  userId: string;
  orderId: string;
  currency: string;
  totalAmount: string;
}

export interface OrderCreatedEvent {
  eventId: string;
  eventType: "OrderCreated";
  aggregateType: "Order";
  aggregateId: string;
  payload: OrderCreatedPayload;
}