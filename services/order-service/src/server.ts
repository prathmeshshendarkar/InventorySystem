import "dotenv/config";
import express from "express";
import router from "./routes";
import { sequelize } from "../src/models/sequelize";
import { errorHandler } from "./middleware/errorHandler";
import { outboxWorker } from "./utils/helpers/container";
import { startOrderEventConsumer } from "./kafka/consumers/orderEvent.consumer";

const app = express();

app.use(express.json());

app.use("/order-service", router);

app.use(errorHandler);
const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log(
      "Database connection established successfully."
    );

    outboxWorker.start();
    await startOrderEventConsumer();

    app.listen(3000, () => {
      console.log(
        "Order service running on port 3000"
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
};

startServer();