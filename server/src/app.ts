import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDatabase } from "./config/database";
import mapRoutes from "./routes/mapRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
connectDatabase();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/maps", mapRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

export default app;
