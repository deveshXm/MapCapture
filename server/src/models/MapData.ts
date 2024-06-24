import mongoose, { Document, Schema } from "mongoose";
import geohash from "ngeohash";

export interface IMapData extends Document {
  userId: mongoose.Types.ObjectId;
  center: [number, number];
  zoom: number;
  capturedImage: string;
  annotation?: string;
  createdAt: Date;
  geohash: string;
}

const MapDataSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  center: { type: [Number], required: true },
  zoom: { type: Number, required: true },
  capturedImage: { type: String, required: true },
  annotation: { type: String },
  createdAt: { type: Date, default: Date.now },
  geohash: { type: String, index: true },
});

// Pre-save hook to generate geohash
MapDataSchema.pre<IMapData>("save", function (next) {
  if (this.isModified("center")) {
    this.geohash = geohash.encode(this.center[1], this.center[0], 5);
  }
  next();
});

export default mongoose.model<IMapData>("MapData", MapDataSchema);
