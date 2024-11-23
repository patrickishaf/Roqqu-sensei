import {AppConfig} from "./app.config";
import * as process from "node:process";
import dotenv from "dotenv";

dotenv.config();

export const devConfig: AppConfig = {
  dbUrl: process.env.DB_URL ?? "",
}

export const testConfig: AppConfig = {
  dbUrl: process.env.DB_URL_TEST ?? "",
}