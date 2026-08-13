import Decimal from "decimal.js";
import { AppError } from "../../utils/errors/AppError";
import { sequelize } from "../../models/sequelize";
import { Order, OrderStatus } from "../../models";

import {
  OrderRepository,
  CreateOrderData,
} from "../../repositories/orders/orders.repository";

import {
  OrderItemRepository,
  CreateOrderItemData,
} from "../../repositories/order_items/orderItems.repository";

import {
  OutboxRepository,
} from "../../repositories/outbox/outbox.repository";

interface CreateOrderInput {
  userId: string;

  currency: string;

  items: {
    productId: string;
    quantity: number;
    unitPrice: string;
  }[];
}

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly outboxRepository: OutboxRepository
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    // Business rule: an order must contain at least one item.
    if (input.items.length === 0) {
      throw new AppError(
        "Order must contain at least one item",
        400
      );
    }

    return sequelize.transaction(async (transaction) => {
      // Calculate the order total using Decimal instead of
      // JavaScript floating-point arithmetic.
      const totalAmount = input.items.reduce(
        (total, item) => {
          const itemTotal = new Decimal(item.unitPrice).mul(item.quantity);

          return total.plus(itemTotal);
        },
        new Decimal(0)
      );

      const orderData: CreateOrderData = {
        userId: input.userId,
        totalAmount: totalAmount.toFixed(2),
        currency: input.currency,
        status: OrderStatus.PENDING,
      };

      // 1. Create the order within the transaction.
      const order = await this.orderRepository.create(
        orderData,
        transaction
      );

      // 2. Prepare order items using the newly-created order ID.
      const orderItems: CreateOrderItemData[] = input.items.map(
        (item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })
      );

      // 3. Create all order items within the same transaction.
      await this.orderItemRepository.createMany(
        orderItems,
        transaction
      );

      // 4. Create the OrderCreated event in the Outbox.
      await this.outboxRepository.create(
        {
          aggregateType: "Order",
          aggregateId: order.id,
          eventType: "OrderCreated",
          payload: {
            orderId: order.id,
            userId: order.userId,
            status: order.status,
            totalAmount: order.totalAmount,
            currency: order.currency,
            items: orderItems,
          },
        },
        transaction
      );

      // 5. Fetch the complete order with its items.
      const createdOrder =
        await this.orderRepository.findByIdWithItems(
          order.id,
          transaction
        );

      if (!createdOrder) {
        throw new Error(
          `Order ${order.id} was created but could not be retrieved`
        );
      }

      return createdOrder;
    });
  }
}