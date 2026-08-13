import { Router } from "express";
import getOrdersRouter from "./get-orders/get-orders.routes";

const router = Router();

router.get('/health-checkup', (req, res) => {
    res.json({
        status: "ok",
        service: "Order Service"
    })
})


router.use('/orders', getOrdersRouter)

export default router;