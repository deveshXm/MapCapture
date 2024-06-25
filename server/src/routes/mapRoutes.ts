import express from "express";
import * as mapController from "../controllers/mapController";

const router = express.Router();

router.post("/", mapController.saveMapData);
router.get("/user",mapController.getUserMapData);
router.get("/top", mapController.getTopRegions);
router.get("/top/24h", mapController.getTopRegions24H);
router.get("/:id", mapController.getMapData);

export default router;
