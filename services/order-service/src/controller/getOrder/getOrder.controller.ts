import { NextFunction, Request, Response } from "express";

import { orderQueryService } from "../../utils/helpers/container";

export const getOrderController = async (
  req: Request<{ orderId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await orderQueryService.getOrderById(
      req.params.orderId
    );

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};