import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectRedis } from "./config/redis";
import { connectDatabase } from "./config/database";

import mapRoutes from "./routes/mapRoutes";
import userRoutes from "./routes/userRoutes";

import { auth } from "./middleware/auth";
import { cacheInit } from "./config/cache";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
connectRedis();
connectDatabase();
cacheInit();

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN, }));
app.use("/api/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/users", userRoutes);
app.use("/api/maps", auth, mapRoutes);
app.use(errorHandler);

export default app;
