import { Transaction } from "sequelize";

import { OrderItem } from "../../models";

export interface CreateOrderItemData {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
}

export class OrderItemRepository {
  async create(
    data: CreateOrderItemData,
    transaction: Transaction
  ): Promise<OrderItem> {
    return OrderItem.create(
      {
        orderId: data.orderId,
        productId: data.productId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
      },
      {
        transaction,
      }
    );
  }

  async createMany(
    items: CreateOrderItemData[],
    transaction: Transaction
  ): Promise<OrderItem[]> {
    return OrderItem.bulkCreate(items, {
      transaction,
    });
  }

  async findByOrderId(
    orderId: string,
    transaction?: Transaction
  ): Promise<OrderItem[]> {
    return OrderItem.findAll({
      where: {
        orderId,
      },
      transaction,
      order: [["createdAt", "ASC"]],
    });
  }
}