import { NextFunction, Request, Response } from "express";

import { orderService } from "../../utils/helpers/container";

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await orderService.createOrder(
      req.validated.body
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};