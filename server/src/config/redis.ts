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
};

redisClient.on('error', (err) => console.log('Redis Client Error', err));