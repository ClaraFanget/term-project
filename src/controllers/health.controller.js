const mongoose = require("mongoose");
const redisClient = require("../config/redis");

const healthCheck = async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      api: "up",
      database: "down",
      redis: "down",
    },
  };

  try {
    if (mongoose.connection.readyState === 1) {
      health.services.database = "up";
    }

    if (redisClient?.isOpen) {
      await redisClient.ping();
      health.services.redis = "up";
    }

    return res.status(200).json(health);
  } catch (err) {
    health.status = "degraded";
    return res.status(500).json(health);
  }
};

module.exports = { healthCheck };
