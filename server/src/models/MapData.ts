import mongoose, { Document, Schema } from "mongoose";
import geohash from "ngeohash";

export type Annotation = { latitude: number; longitude: number; note: string } | null;

export interface IMapData extends Document {
  userId: mongoose.Types.ObjectId;
  center: [number, number];
  zoom: number;
  capturedImage: string;
  annotation?: Annotation;
  createdAt: Date;
  geohash: string;
}

const AnnotationSchema: Schema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    note: { type: String, required: true },
  },
  { _id: false }
);

const MapDataSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  center: { type: [Number], required: true },
  zoom: { type: Number, required: true },
  capturedImage: { type: String, required: true },
  annotation: { type: AnnotationSchema, default: null },
  createdAt: { type: Date, default: Date.now },
  geohash: { type: String, index: true },
});

// Pre-save hook to generate geohash
MapDataSchema.pre<IMapData>("save", function (next) {
  if (this.isModified("center")) {
    this.geohash = geohash.encode(this.center[1], this.center[0], 3);
  }
  next();
});

export default mongoose.model<IMapData>("MapData", MapDataSchema);
