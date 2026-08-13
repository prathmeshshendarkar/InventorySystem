import { Request, Response } from "express";
import { getOrdersService } from "../../services/get-orders.ts/get-orders.services";

export const getOrdersController = async (req : Request, res : Response) => {
    const getOrders = await getOrdersService();

    let responseObj = {
        "Orders" : [{}],
        "Status" : "Success"
    }

    res.status(200).json(responseObj)
}

export const getOrdersByIdController = (req : Request, res : Response) => {
    const { id } = req.params;

    let responseObj = {
        "Order-Id" : id,
        "Status" : "Success"
    }

    res.status(200).json(responseObj)
}