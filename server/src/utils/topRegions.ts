import geohash from "ngeohash";
import { PipelineStage } from "mongoose";

import MapData from "../models/MapData";

export const fetchTopRegions = async () => {
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
    const region = geohash.decode_bbox(item._id);
    return {
      region,
      geohash: item._id,
      count: item.count,
    };
  });
  return topRegions;
};

export const fetchTopRegions24H = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const pipeline: PipelineStage[] = [
    {
      $match: {
        createdAt: { $gte: twentyFourHoursAgo },
      },
    },
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

  const topRegions24H = result.map((item) => {
    const region = geohash.decode_bbox(item._id);
    return {
      region,
      geohash: item._id,
      count: item.count,
    };
  });
  return topRegions24H;
};
