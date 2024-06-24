import { GeographicBoundingBox } from "ngeohash";

import ApiError from "../utils/ApiError";
import { redisClient } from "../config/redis";
import MapData, { IMapData } from "../models/MapData";
import { fetchTopRegions, fetchTopRegions24H } from "../utils/topRegions";

const CACHE_EXPIRATION = 120; // 120 sec

export const saveMapData = async (mapData: IMapData): Promise<IMapData> => {
  const newMapData = await MapData.create(mapData);
  return newMapData;
};

export const getMapData = async (id: string): Promise<IMapData> => {
  const cachedData = await redisClient.get(`mapData:${id}`);
  if (cachedData) return JSON.parse(cachedData);
  const mapData = await MapData.findById(id);
  if (!mapData) throw new ApiError(404, "Map data not found");
  // cache map data for 120 seconds
  await redisClient.set(`mapData:${id}`, JSON.stringify(mapData), {
    EX: CACHE_EXPIRATION,
  });
  return mapData;
};

export const getUserMapData = async (userId: string, page: number, limit: number): Promise<{ data: IMapData[]; total: number }> => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([MapData.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit), MapData.countDocuments({ userId })]);
  return { data, total };
};

// GET: All time most frequent regions
export const getTopRegions = async (): Promise<{ geohash: string; region: GeographicBoundingBox; count: number }[]> => {
  // check in cache (redis)
  const cacheKey = "topRegions";
  const cachedTopRegions = await redisClient.get(cacheKey);
  if (cachedTopRegions) return JSON.parse(cachedTopRegions);
  // fallback to db
  const topRegions = await fetchTopRegions();
  return topRegions;
};

// GET: Most frequent regions from last 24h
export const getTopRegions24H = async (): Promise<{ geohash: string; region: GeographicBoundingBox; count: number }[]> => {
  // check in cache
  const cacheKey = "topRegions24h";
  const cachedTopRegions = await redisClient.get(cacheKey);
  if (cachedTopRegions) return JSON.parse(cachedTopRegions);
  // fallback to db
  const topRegions24H = await fetchTopRegions24H();
  return topRegions24H;
};
