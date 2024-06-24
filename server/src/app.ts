import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectRedis } from "./config/redis";
import { connectDatabase } from "./config/database";

import mapRoutes from "./routes/mapRoutes";
import userRoutes from "./routes/userRoutes";

import { errorHandler } from "./middleware/errorHandler";
import { cacheInit } from "./services/cacheService";

dotenv.config();
connectRedis();
connectDatabase();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/maps", mapRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

cacheInit();

export default app;
