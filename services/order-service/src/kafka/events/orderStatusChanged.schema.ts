import Joi from "joi";
import { OrderStatus } from "../../models";

export const orderStatusChangedEventSchema =
  Joi.object({
    eventId: Joi.string().uuid().required(),

    eventType: Joi.string()
      .valid("OrderStatusChanged")
      .required(),

    aggregateType: Joi.string()
      .valid("Order")
      .required(),

    aggregateId: Joi.string().uuid().required(),

    payload: Joi.object({
      orderId: Joi.string().uuid().required(),

      previousStatus: Joi.string()
        .valid(...Object.values(OrderStatus))
        .required(),

      newStatus: Joi.string()
        .valid(...Object.values(OrderStatus))
        .required(),
    }).required(),
  });