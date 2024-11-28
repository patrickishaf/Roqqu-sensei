import mongoose from "mongoose";
import config from "../config";

export * from "./models";

export const connectToDb = async () => {
  await mongoose.connect(config.dbUrl);
  console.log("Connected to MongoDB");
}