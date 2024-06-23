import mongoose, { Document, Schema } from 'mongoose';

export interface IMapData extends Document {
  userId: mongoose.Types.ObjectId;
  center: [number, number];
  zoom: number;
  capturedImage: string;
  annotation?: string;
  createdAt: Date;
}

const MapDataSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  center: { type: [Number], required: true },
  zoom: { type: Number, required: true },
  capturedImage: { type: String, required: true },
  annotation: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMapData>('MapData', MapDataSchema);