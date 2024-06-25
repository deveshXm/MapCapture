import { createClient } from "redis";
import { config } from "dotenv";
import { TOP_REGIONS_24H_CACHE_KEY, TOP_REGIONS_24H_ZUNION_KEY, TOP_REGIONS_CACHE_KEY } from "./cache";

config();

export const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
});

export const connectRedis = async () => {
  await redisClient.connect();
  await redisClient.flushDb();
  console.log("Connected to Redis.");
};

export const disconnectRedis = async () => {
  await redisClient.disconnect();
  console.log("Disconnected from Redis.");
};

redisClient.on("error", (err) => console.log("Redis Client Error", err));
