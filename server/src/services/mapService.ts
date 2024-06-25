import { Mutex } from "async-mutex";

import ApiError from "../utils/ApiError";
import { redisClient } from "../config/redis";
import MapData, { IMapData } from "../models/MapData";
import { fetchTopRegions24HFromDB, fetchTopRegionsFromDB } from "../utils/topRegions";
import {
  getLast24HoursKeys,
  TOP_REGIONS_24H_CACHE_KEY,
  TOP_REGIONS_24H_CACHE_TTL,
  TOP_REGIONS_24H_ZUNION_KEY,
  TOP_REGIONS_CACHE_KEY,
  TOP_REGIONS_CACHE_TTL,
} from "../config/cache";
import { pushGeohashToQueue } from "../config/queue";

const mutex = new Mutex();

export const saveMapData = async (mapData: IMapData): Promise<IMapData> => {
  const newMapData = await MapData.create(mapData);
  await newMapData.save();
  pushGeohashToQueue(newMapData.geohash);
  return newMapData;
};

export const getMapData = async (id: string): Promise<IMapData> => {
  const cachedData = await redisClient.get(`mapData:${id}`);
  if (cachedData) return JSON.parse(cachedData);
  const mapData = await MapData.findById(id);
  if (!mapData) throw new ApiError(404, "Map data not found");
  return mapData;
};

export const getUserMapData = async (userId: string, page: number, limit: number): Promise<{ data: IMapData[]; total: number }> => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([MapData.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit), MapData.countDocuments({ userId })]);
  return { data, total };
};

// GET: All time most frequent regions
export const getTopRegions = async (): Promise<{ geohash: string; count: number }[]> => {
  // Try to get data from Redis cache
  const cachedData = await redisClient.get(TOP_REGIONS_CACHE_KEY);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  // If not in cache, use mutex to prevent cache stampede
  const release = await mutex.acquire();
  try {
    // Check cache again in case another process has already updated it
    const cachedData = await redisClient.get(TOP_REGIONS_CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const topRegions = await fetchTopRegionsFromDB();
    await redisClient.setEx(TOP_REGIONS_CACHE_KEY, TOP_REGIONS_CACHE_TTL, JSON.stringify(topRegions));
    return topRegions;
  } finally {
    release();
  }
};

// GET: Most frequent regions from last 24h
export const getTopRegions24H = async (): Promise<{ geohash: string; count: number }[]> => {
  // Try to get data from Redis cache
  const cachedData = await redisClient.get(TOP_REGIONS_24H_CACHE_KEY);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  // If not in cache, use mutex to prevent cache stampede
  const release = await mutex.acquire();
  try {
    // Check cache again in case another process has already updated it
    const cachedDataCheck = await redisClient.get(TOP_REGIONS_24H_CACHE_KEY);
    if (cachedDataCheck) {
      return JSON.parse(cachedDataCheck);
    }
    // Try to get data from Redis sorted sets
    // Combine the sorted sets for the last 24 hours
    const keys = getLast24HoursKeys();
    await redisClient.zUnionStore(TOP_REGIONS_24H_ZUNION_KEY, keys);
    const topGeohashes = (await redisClient.sendCommand(["ZREVRANGE", TOP_REGIONS_24H_ZUNION_KEY, "0", "2", "WITHSCORES"])) as string[];
    // Then process the results like this:
    if (topGeohashes.length > 0) {
      const result = [];
      for (let i = 0; i < topGeohashes.length; i += 2) {
        result.push({
          geohash: topGeohashes[i],
          count: parseInt(topGeohashes[i + 1]),
        });
      }
      // Cache the result
      await redisClient.setEx(TOP_REGIONS_24H_CACHE_KEY, TOP_REGIONS_24H_CACHE_TTL, JSON.stringify(result));
      return result;
    }

    // Fallback to MongoDB if Redis doesn't have data
    const topRegions24H = await fetchTopRegions24HFromDB();

    // Cache the result from MongoDB
    await redisClient.setEx(TOP_REGIONS_24H_CACHE_KEY, TOP_REGIONS_24H_CACHE_TTL, JSON.stringify(topRegions24H));
    return topRegions24H;
  } catch (error) {
    console.error("Error fetching top regions:", error);
    return [];
  } finally {
    release();
  }
};
