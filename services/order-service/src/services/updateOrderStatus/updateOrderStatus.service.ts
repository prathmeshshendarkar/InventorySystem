import { sequelize } from "../../models/sequelize";
import { Order, OrderStatus } from "../../models";
import { AppError } from "../../utils/errors/AppError";

import { OrderRepository } from "../../repositories/orders/orders.repository";
import { OutboxRepository } from "../../repositories/outbox/outbox.repository";

interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
}

export class UpdateOrderStatusService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly outboxRepository: OutboxRepository
  ) {}

  async updateStatus(
    input: UpdateOrderStatusInput
  ): Promise<Order> {
    return sequelize.transaction(async (transaction) => {
      const order =
        await this.orderRepository.findByIdForUpdate(
          input.orderId,
          transaction
        );

      if (!order) {
        throw new AppError(
          "Order not found",
          404
        );
      }

      const previousStatus = order.status;
      const newStatus = input.status;

      if (previousStatus === newStatus) {
        throw new AppError(
          `Order is already in ${newStatus} status`,
          400
        );
      }

      this.validateStatusTransition(
        previousStatus,
        newStatus
      );

      const [affectedCount] =
        await this.orderRepository.updateStatus(
          order.id,
          newStatus,
          transaction
        );

      if (affectedCount !== 1) {
        throw new Error(
          `Failed to update order status: ${order.id}`
        );
      }

      await this.outboxRepository.create(
        {
          aggregateType: "Order",
          aggregateId: order.id,
          eventType: "OrderStatusChanged",
          payload: {
            orderId: order.id,
            previousStatus,
            newStatus,
          },
        },
        transaction
      );

      order.status = newStatus;

      return order;
    });
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ): void {
    const allowedTransitions: Record<
      OrderStatus,
      OrderStatus[]
    > = {
      [OrderStatus.PENDING]: [
        OrderStatus.CONFIRMED,
        OrderStatus.CANCELLED,
      ],

      [OrderStatus.CONFIRMED]: [
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED,
      ],

      [OrderStatus.PROCESSING]: [
        OrderStatus.SHIPPED,
        OrderStatus.CANCELLED,
      ],

      [OrderStatus.SHIPPED]: [
        OrderStatus.DELIVERED,
      ],

      [OrderStatus.DELIVERED]: [],

      [OrderStatus.CANCELLED]: [],
    };

    const allowedStatuses =
      allowedTransitions[currentStatus];

    if (!allowedStatuses.includes(newStatus)) {
      throw new AppError(
        `Invalid status transition: ${currentStatus} → ${newStatus}`,
        400
      );
    }
  }
}