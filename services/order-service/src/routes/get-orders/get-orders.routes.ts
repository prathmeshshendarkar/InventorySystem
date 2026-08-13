import { getOrdersByIdController, getOrdersController } from "../../controller/get-orders/get-orders.controller";
import { Router } from "express";
import { getOrderByIdSchema, getOrdersSchema } from "../../validation/get-orders/get-orders.validation";
import { validate } from "../../utils/helpers/requestValidation";

const getOrdersRouter = Router();

getOrdersRouter.get('/', validate(getOrdersSchema, 'query'), getOrdersController)
getOrdersRouter.get('/:id', validate(getOrderByIdSchema, 'params') ,getOrdersByIdController)

export default getOrdersRouter;