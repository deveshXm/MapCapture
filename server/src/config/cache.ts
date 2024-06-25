import { CronJob } from "cron";

import { fetchTopRegionsFromDB } from "../utils/topRegions";
import { redisClient } from "./redis";

export const TOP_REGIONS_CACHE_TTL = 3600; // 1 hour in seconds
export const TOP_REGIONS_CACHE_KEY = "topRegions";
export const TOP_REGIONS_24H_CACHE_TTL = 60; // 1 min in seconds
export const TOP_REGIONS_24H_CACHE_KEY = "topRegions24H";
export const TOP_REGIONS_24H_MAX_SET_SIZE = 100;
export const TOP_REGIONS_24H_ZUNION_KEY = "tempTopRegions24H";

let cacheRefreshJob: CronJob | null = null;

const refreshCache = async () => {
  try {
    const topRegions = await fetchTopRegionsFromDB();
    await redisClient.setEx(TOP_REGIONS_CACHE_KEY, TOP_REGIONS_CACHE_TTL, JSON.stringify(topRegions));
    console.log("Cache refreshed successfully");
  } catch (error) {
    console.error("Failed to refresh cache:", error);
  }
};

export const startCacheRefreshJob = () => {
  if (cacheRefreshJob) {
    console.log("Cache refresh job already running");
    return;
  }
  cacheRefreshJob = new CronJob("0 * * * *", refreshCache, null, true, "UTC");
  console.log("Cache refresh job started");
};

export const stopCacheRefreshJob = () => {
  if (cacheRefreshJob) {
    cacheRefreshJob.stop();
    cacheRefreshJob = null;
    console.log("Cache refresh job stopped");
  } else {
    console.log("No cache refresh job running");
  }
};

// Helper function to get the current hour key
export const getCurrentHourKey = () => {
  const now = new Date();
  return `geohash:${now.getUTCFullYear()}${(now.getUTCMonth() + 1).toString().padStart(2, "0")}${now
    .getUTCDate()
    .toString()
    .padStart(2, "0")}_${now.getUTCHours().toString().padStart(2, "0")}`;
};

// Helper function to get keys for the last 24 hours
export const getLast24HoursKeys = () => {
  const keys = [];
  for (let i = 0; i < 24; i++) {
    const date = new Date(Date.now() - i * 60 * 60 * 1000);
    keys.push(
      `geohash:${date.getUTCFullYear()}${(date.getUTCMonth() + 1).toString().padStart(2, "0")}${date
        .getUTCDate()
        .toString()
        .padStart(2, "0")}_${date.getUTCHours().toString().padStart(2, "0")}`
    );
  }
  return keys;
};

// Helper function to increment geohash count
export const incrementGeohashCount = async (geohash: string) => {
  const key = getCurrentHourKey();
  await redisClient.zIncrBy(key, 1, geohash);
  await redisClient.expire(key, 60 * 60 * 26); // Expire after 26 hours

  // Check if set size exceeds threshold and trim if necessary
  const setSize = await redisClient.zCard(key);
  if (setSize > TOP_REGIONS_24H_MAX_SET_SIZE) {
    await redisClient.zRemRangeByRank(key, 0, setSize - TOP_REGIONS_24H_MAX_SET_SIZE - 1);
  }
};
