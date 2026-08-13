import { Router } from "express";
import ordersRouter from "./createOrder/createOrder.routes";

const router = Router();

router.get('/health-checkup', (req, res) => {
    res.json({
        status: "ok",
        service: "Order Service"
    })
})


router.use("/orders", ordersRouter);

export default router;