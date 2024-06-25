import { createClient } from "redis";
import { config } from "dotenv";
import { TOP_REGIONS_24H_CACHE_KEY } from "./cache";

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
  await redisClient.del(TOP_REGIONS_24H_CACHE_KEY)
  await redisClient.del(TOP_REGIONS_24H_CACHE_KEY)
  console.log("Connected to Redis.");
};

export const disconnectRedis = async () => {
  await redisClient.disconnect();
  console.log("Disconnected from Redis.");
};

redisClient.on("error", (err) => console.log("Redis Client Error", err));
