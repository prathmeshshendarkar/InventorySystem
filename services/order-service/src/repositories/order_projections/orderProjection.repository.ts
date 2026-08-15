import { Transaction } from "sequelize";
import { OrderProjection } from "../../models";

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
}