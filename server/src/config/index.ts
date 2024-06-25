import fs from "fs";
import path from "path";

import { shutdownQueue } from "./queue";
import { connectDatabase, disconnectDatabase } from "./database";
import { startCacheRefreshJob, stopCacheRefreshJob } from "./cache";
import { connectRedis, disconnectRedis, redisClient } from "./redis";

export async function startup() {
  try {
    const uploadsDir = path.join(__dirname, "../..", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`Created uploads directory at ${uploadsDir}`);
    }
    await connectDatabase();
    await connectRedis();
    startCacheRefreshJob();
  } catch (error) {
    console.error("Couldn't startup. Killing the process.", error);
    process.exit(1);
  }
}

export async function shutdown() {
  try {
    stopCacheRefreshJob();
    await shutdownQueue();
    await disconnectRedis();
    await disconnectDatabase();
  } catch (error) {
    console.error("Couldn't shutdown gracefully. Killing the process", error);
  }
  process.exit(0);
}
