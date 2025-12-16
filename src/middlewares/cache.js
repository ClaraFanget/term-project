const redisClient = require("../config/redis");

const cache = (keyBuilder, ttl = 60) => {
  return async (req, res, next) => {
    try {
      const key = keyBuilder(req);

      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return res.status(200).json({
          status: "success",
          source: "cache",
          data: JSON.parse(cachedData),
        });
      }

      res.locals.cacheKey = key;
      res.locals.cacheTTL = ttl;
      next();
    } catch (err) {
      next();
    }
  };
};

module.exports = cache;
