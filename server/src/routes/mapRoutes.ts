import express from "express";
import * as mapController from "../controllers/mapController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, mapController.saveMapData);
router.get("/user", protect, mapController.getUserMapData);
router.get("/top", mapController.getTopRegions);
router.get("/top/24h", mapController.getTopRegions24H);
router.get("/:id", protect, mapController.getMapData);

export default router;
