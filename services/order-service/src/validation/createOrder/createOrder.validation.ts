import Joi from "joi";

export const createOrderSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required(),

  currency: Joi.string()
    .length(3)
    .uppercase()
    .required(),

  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .uuid()
          .required(),

        quantity: Joi.number()
          .integer()
          .positive()
          .required(),

        unitPrice: Joi.string()
          .pattern(/^\d+(\.\d{1,2})?$/)
          .required(),
      })
    )
    .min(1)
    .required(),
});