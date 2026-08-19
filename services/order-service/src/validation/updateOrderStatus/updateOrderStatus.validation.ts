import Joi from "joi";
import { OrderStatus } from "../../models";

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required(),
});