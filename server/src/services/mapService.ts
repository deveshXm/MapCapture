import geohash from "ngeohash";
import { PipelineStage } from "mongoose";

import ApiError from "../utils/ApiError";
import { redisClient } from "../config/redis";
import MapData, { IMapData } from "../models/MapData";

const CACHE_EXPIRATION = 30; // 30 sec

export const saveMapData = async (mapData: IMapData): Promise<IMapData> => {
  const newMapData = await MapData.create(mapData);
  await redisClient.zIncrBy("top_regions", 1, newMapData.geohash);
  return newMapData;
};

export const getMapData = async (id: string): Promise<IMapData> => {
  const cachedData = await redisClient.get(`mapData:${id}`);
  if (cachedData) return JSON.parse(cachedData);

  const mapData = await MapData.findById(id);
  if (!mapData) throw new ApiError(404, "Map data not found");

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

export const getTopRegions = async (): Promise<{ region: string; count: number }[]> => {
  const cachedTopRegions = await redisClient.get("topRegions");
  if (cachedTopRegions) return JSON.parse(cachedTopRegions);
  const pipeline: PipelineStage[] = [
    {
      $group: {
        _id: "$geohash",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 } as const,
    },
    {
      $limit: 3,
    },
  ];
  const result = await MapData.aggregate(pipeline);
  const topRegions = result.map((item) => {
    const { latitude, longitude } = geohash.decode(item._id);
    return {
      region: `${latitude},${longitude}`,
      count: item.count,
    };
  });
  await redisClient.set("topRegions", JSON.stringify(topRegions), {
    EX: CACHE_EXPIRATION,
  });
  return topRegions;
};
