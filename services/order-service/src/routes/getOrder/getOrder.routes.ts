import { Router } from "express";

import { getOrderController } from "../../controller/getOrder/getOrder.controller";

const ordersRouter = Router();

ordersRouter.get(
  "/:orderId",
  getOrderController
);

export default ordersRouter;