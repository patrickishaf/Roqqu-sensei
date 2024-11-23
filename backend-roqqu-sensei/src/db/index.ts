import mongoose from "mongoose";
import config from "../config";

export const connectToDb = async () => {
  await mongoose.connect(config.dbUrl);
}