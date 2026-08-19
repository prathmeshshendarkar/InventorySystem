import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  updateOrderStatusService,
} from "../../utils/helpers/container";

export const updateOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order =
      await updateOrderStatusService.updateStatus({
        orderId: req.validated.params.orderId,
        status: req.validated.body.status,
      });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};