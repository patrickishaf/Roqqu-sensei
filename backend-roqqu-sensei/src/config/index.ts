import devConfig from "./dev";

const pickConfigurationFromEnvironment = () => {
  const configForEnvironment = {
    dev: devConfig,
    production: devConfig,
    test: devConfig,
  }
  const environment = process.env.NODE_ENV || 'development';
  return configForEnvironment[environment as keyof typeof configForEnvironment];
}

