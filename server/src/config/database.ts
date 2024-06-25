import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to MongoDB");
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};
