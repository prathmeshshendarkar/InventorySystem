import { NextFunction, Request, Response } from "express";
import Joi from "joi";

type ValidationSource = 'body' | 'query' | 'params';

export const validate = (schema: Joi.ObjectSchema, source: ValidationSource = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            });
        }

        // Store validated values on req.validated
        if (!req.validated) {
            req.validated = {};
        }
        req.validated[source] = value;
        
        next();
    };
};