import {AppConfig} from "./appconfig";
import * as process from "node:process";
import dotenv from "dotenv";
import path from "node:path";

const loadConfigFileFromEnvironment = () => {
  const env = process.env.NODE_ENV!;
  const fileName = (env === "development") ? ".env.development" : (env === "test") ? ".env.test" : ".env"
  const pathToEnvFile = path.join(__dirname, '..', '..', fileName);
  dotenv.configDotenv({ path: pathToEnvFile });
}

export const getConfig = (): AppConfig => {
  loadConfigFileFromEnvironment();
  const config: AppConfig = {
    nodeEnv: process.env.NODE_ENV ?? "",
    dbUrl: process.env.DB_URL ?? "",
    port: process.env.PORT ?? "3000",
    openAiApiKey: process.env.OPENAI_API_KEY ?? "",
    tokenSecret: process.env.TOKEN_SECRET ?? "",
    encryptionKey: process.env.ENCRYPTION_KEY ?? "",
  }
  return config;
}