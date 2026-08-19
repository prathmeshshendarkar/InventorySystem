import { Router } from "express";
import {
  updateOrderStatusController,
} from "../../controller/updateOrderStatus/updateOrderStatus.controller";
import { validate } from "../../utils/helpers/requestValidation";
import {
  updateOrderStatusSchema,
} from "../../validation/updateOrderStatus/updateOrderStatus.validation";
import {
  updateOrderStatusParamsSchema,
} from "../../validation/updateOrderStatus/updateOrderStatus.params.validation";

const router = Router();

router.patch(
  "/:orderId/status",
  validate(
    updateOrderStatusParamsSchema,
    "params"
  ),
  validate(
    updateOrderStatusSchema,
    "body"
  ),
  updateOrderStatusController
);

export default router;