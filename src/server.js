const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");
const redisClient = require("./config/redis"); 

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Connected to MongoDB!");

    await new Promise((resolve, reject) => {
      if (redisClient.isReady) {
        resolve();
      } else {
        redisClient.on("ready", resolve);
        redisClient.on("error", reject);
        setTimeout(() => reject(new Error("Redis connection timeout")), 10000);
      }
    });
    console.log("✓ Connected to Redis!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started and listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await mongoose.connection.close();
  await redisClient.quit();
  process.exit(0);
});

startServer();
