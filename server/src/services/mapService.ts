import MapData, { IMapData } from "../models/MapData";
import ApiError from "../utils/ApiError";
import { cache } from "../config/cache";

export const saveMapData = async (mapData: Partial<IMapData>): Promise<IMapData> => {
  const newMapData = await MapData.create(mapData);
  return newMapData;
};

export const getMapData = async (id: string): Promise<IMapData> => {
  const cachedData = cache.get<IMapData>(id);
  if (cachedData) return cachedData;

  const mapData = await MapData.findById(id);
  if (!mapData) throw new ApiError(404, "Map data not found");

  cache.set(id, mapData);
  return mapData;
};

export const getUserMapData = async (userId: string): Promise<IMapData[]> => {
  return MapData.find({ userId }).sort({ createdAt: -1 });
};

export const getTopRegions = async (): Promise<{ region: string; count: number }[]> => {
  const topRegions = await MapData.aggregate([
    {
      $group: {
        _id: { lat: { $round: [{ $arrayElemAt: ["$center", 0] }, 2] }, lng: { $round: [{ $arrayElemAt: ["$center", 1] }, 2] } },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 3 },
    {
      $project: {
        _id: 0,
        region: {
          $concat: [{ $toString: "$_id.lat" }, ",", { $toString: "$_id.lng" }],
        },
        count: 1,
      },
    },
  ]);

  return topRegions;
};
