import { createClient } from "redis";
import { config } from "dotenv";

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
  console.log("Connected to Redis.");
};

export const disconnectRedis = async () => {
  await redisClient.disconnect();
  console.log("Disconnected from Redis.");
};

redisClient.on("error", (err) => console.log("Redis Client Error", err));
