import { Router } from "express";
import ordersRouter from "./createOrder/createOrder.routes";
import getOrderRouter from "./getOrder/getOrder.routes";
import updateOrderStatusRouter from "./updateOrderStatus/updateOrderStatus.routes";

const router = Router();

router.get('/health-checkup', (req, res) => {
    res.json({
        status: "ok",
        service: "Order Service"
    })
})


router.use("/orders", ordersRouter);
router.use("/orders", getOrderRouter);
router.use("/orders", updateOrderStatusRouter);

export default router;