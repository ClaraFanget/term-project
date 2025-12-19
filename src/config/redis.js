const { createClient } = require("redis");

let redisClient = null;

// ❌ Désactiver Redis complètement pendant les tests
if (process.env.NODE_ENV !== "test") {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  redisClient = createClient({
    url: redisUrl,
  });

  redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
  });

  redisClient.on("connect", () => {
    console.log("Redis connected");
  });

  redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });
}

module.exports = redisClient;
