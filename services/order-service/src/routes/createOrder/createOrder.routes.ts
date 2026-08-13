import { Router } from "express";
import { createOrderController } from "../../controller/createOrder/createOrder.controller";
import { validate } from "../../utils/helpers/requestValidation";
import { createOrderSchema } from "../../validation/createOrder/createOrder.validation";

const ordersRouter = Router();

ordersRouter.post(
  "/",
  validate(createOrderSchema, "body"),
  createOrderController
);

export default ordersRouter;