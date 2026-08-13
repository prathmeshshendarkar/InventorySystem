import Joi from "joi";

// Define schemas
export const getOrdersSchema = Joi.object({
    // Query parameters validation (for GET /orders?page=1&limit=10)
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'id').default('createdAt'),
    order: Joi.string().valid('ASC', 'DESC').default('DESC'),
    status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled')
});

export const getOrderByIdSchema = Joi.object({
    // URL params validation
    id: Joi.string().pattern(/^[0-9]+$/).required().messages({
        'string.pattern.base': 'ID must be a number',
        'any.required': 'ID is required'
    })
});