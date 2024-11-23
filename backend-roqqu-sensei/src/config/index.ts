import {devConfig} from "./environments";

const pickConfigurationFromEnvironment = () => {
  const configForEnvironment = {
    development: devConfig,
    production: devConfig,
    test: devConfig,
  }
  const environment = process.env.NODE_ENV || 'development';
  return configForEnvironment[environment as keyof typeof configForEnvironment];
}

const config = pickConfigurationFromEnvironment();

console.log({ env: process.env.NODE_ENV, config });

export default config;

