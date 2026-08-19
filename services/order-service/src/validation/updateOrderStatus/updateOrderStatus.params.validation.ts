import Joi from "joi";

export const updateOrderStatusParamsSchema =
  Joi.object({
    orderId: Joi.string().uuid().required(),
  });