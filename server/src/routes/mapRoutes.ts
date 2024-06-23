import express from "express";
import * as mapController from "../controllers/mapController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, mapController.saveMapData);
router.get("/user/maps", protect, mapController.getUserMapData);
router.get("/top-regions", mapController.getTopRegions);
router.get("/:id", protect, mapController.getMapData);

export default router;
