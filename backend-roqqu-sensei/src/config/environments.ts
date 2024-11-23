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

export const prodConfig: AppConfig = {
  dbUrl: process.env.DB_URL ?? ""
}

export const pickConfigurationFromEnvironment = (): AppConfig => {
  const configForEnvironment = {
    development: devConfig,
    production: devConfig,
    test: testConfig,
  }
  const environment = process.env.NODE_ENV || 'development';
  return configForEnvironment[environment as keyof typeof configForEnvironment];
}

export const loadConfigFromEnvironment = () => {
  // TODO: Read the right .env file and load the configs in it
}