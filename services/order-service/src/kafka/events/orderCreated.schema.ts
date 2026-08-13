import Joi from "joi";

export const orderCreatedEventSchema = Joi.object({
  eventId: Joi.string().uuid().required(),

  eventType: Joi.string()
    .valid("OrderCreated")
    .required(),

  aggregateType: Joi.string()
    .valid("Order")
    .required(),

  aggregateId: Joi.string().uuid().required(),

  payload: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          orderId: Joi.string().uuid().required(),
          quantity: Joi.number().integer().positive().required(),
          productId: Joi.string().uuid().required(),
          unitPrice: Joi.string().required(),
        })
      )
      .min(1)
      .required(),

    status: Joi.string().required(),

    userId: Joi.string().uuid().required(),

    orderId: Joi.string().uuid().required(),

    currency: Joi.string().required(),

    totalAmount: Joi.string().required(),
  }).required(),
});