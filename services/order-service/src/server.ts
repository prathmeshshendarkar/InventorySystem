import "dotenv/config";
import express from "express";
import router from "./routes";

const app = express();

app.use(express.json())

app.use('/order-service', router);

app.listen(3000, () => {
    console.log("App running on port 3000");
})