import { Request, Response } from "express";
import * as mapService from "../services/mapService";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/auth";
import rateLimit from "express-rate-limit";
import { validateMapData } from "../validators/mapValidators";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // limit each IP to 50 requests per windowMs
});

export const saveMapData = asyncHandler(async (req: AuthRequest, res: Response) => {
  validateMapData(req.body);
  const mapData = await mapService.saveMapData({ ...req.body, userId: req.user?._id });
  res.status(201).json({ success: true, data: mapData });
});

export const getMapData = asyncHandler(async (req: Request, res: Response) => {
  const mapData = await mapService.getMapData(req.params.id);
  res.status(200).json({ success: true, data: mapData });
});

export const getUserMapData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const { data, total } = await mapService.getUserMapData(req.user?._id as string, Number(page), Number(limit));
  res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getTopRegions = [
  limiter,
  asyncHandler(async (req: Request, res: Response) => {
    const topRegions = await mapService.getTopRegions();
    res.status(200).json({ success: true, data: topRegions });
  }),
];

export const getTopRegions24H = [
  limiter,
  asyncHandler(async (req: Request, res: Response) => {
    const topRegions = await mapService.getTopRegions24H();
    res.status(200).json({ success: true, data: topRegions });
  }),
];
