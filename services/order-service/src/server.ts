import "dotenv/config";
import express from "express";
import router from "./routes";
import { sequelize } from "./models";

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Setup routes
    app.use('/order-service', router);
    
    // Start server
    app.listen(3000, () => {
      console.log("App running on port 3000");
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();