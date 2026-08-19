import { Transaction } from "sequelize";
import { OrderProjection, OrderStatus } from "../../models";

export interface CreateOrderProjectionInput {
  orderId: string;
  userId: string;
  totalAmount: string;
  currency: string;
  status: string;
}

export class OrderProjectionRepository {
  async create(
    data: CreateOrderProjectionInput,
    transaction: Transaction
  ): Promise<OrderProjection> {
    return OrderProjection.create(
      {
        orderId: data.orderId,
        userId: data.userId,
        totalAmount: data.totalAmount,
        currency: data.currency,
        status: data.status,
      },
      {
        transaction,
      }
    );
  }

  async findByOrderId(
    orderId: string,
    transaction?: Transaction
  ): Promise<OrderProjection | null> {
    return OrderProjection.findOne({
      where: {
        orderId,
      },
      transaction,
    });
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    transaction: Transaction
  ): Promise<[affectedCount: number]> {
    return OrderProjection.update(
      {
        status,
      },
      {
        where: {
          orderId,
        },
        transaction,
      }
    );
  }
}