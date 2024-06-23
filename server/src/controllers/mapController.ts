import { Request, Response } from "express";
import * as mapService from "../services/mapService";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/auth";
import ApiError from "../utils/ApiError";

export const saveMapData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const mapData = await mapService.saveMapData({ ...req.body, userId: req.user?._id });
  res.status(201).json({ success: true, data: mapData });
});

export const getMapData = asyncHandler(async (req: Request, res: Response) => {
  const mapData = await mapService.getMapData(req.params.id);
  res.status(200).json({ success: true, data: mapData });
});

export const getUserMapData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const mapData = await mapService.getUserMapData(req.user?._id as string);
  res.status(200).json({ success: true, data: mapData });
});

export const getTopRegions = asyncHandler(async (req: Request, res: Response) => {
  const topRegions = await mapService.getTopRegions();
  if (!topRegions || topRegions.length === 0) {
    throw new ApiError(404, "No top regions found");
  }
  res.status(200).json({ success: true, data: topRegions });
});
