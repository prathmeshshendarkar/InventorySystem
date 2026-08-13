import { Transaction } from "sequelize";

import { Order, OrderStatus } from "../../models";

export interface CreateOrderData {
  userId: string;
  totalAmount: string;
  currency: string;
  status?: OrderStatus;
}

export class OrderRepository {
  async create(
    data: CreateOrderData,
    transaction: Transaction
  ): Promise<Order> {
    return Order.create(
      {
        userId: data.userId,
        totalAmount: data.totalAmount,
        currency: data.currency,
        status: data.status ?? OrderStatus.PENDING,
      },
      {
        transaction,
      }
    );
  }

  async findById(
    orderId: string,
    transaction?: Transaction
  ): Promise<Order | null> {
    return Order.findByPk(orderId, {
      transaction,
    });
  }

  async findByIdWithItems(
    orderId: string,
    transaction?: Transaction
  ): Promise<Order | null> {
    return Order.findByPk(orderId, {
      include: [
        {
          association: "items",
        },
      ],
      transaction,
    });
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    transaction: Transaction
  ): Promise<[affectedCount: number]> {
    return Order.update(
      {
        status,
      },
      {
        where: {
          id: orderId,
        },
        transaction,
      }
    );
  }
}