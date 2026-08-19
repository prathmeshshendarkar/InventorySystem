import { AppError } from "../../utils/errors/AppError";
import { OrderProjection } from "../../models";
import { OrderProjectionRepository } from "../../repositories";

export class OrderQueryService {
  constructor(
    private readonly orderProjectionRepository: OrderProjectionRepository
  ) {}

  async getOrderById(
    orderId: string
  ): Promise<OrderProjection> {
    const orderProjection =
      await this.orderProjectionRepository.findByOrderId(
        orderId
      );

    if (!orderProjection) {
      throw new AppError(
        `Order ${orderId} was not found`,
        404
      );
    }

    return orderProjection;
  }
}