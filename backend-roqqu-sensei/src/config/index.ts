import {pickConfigurationFromEnvironment} from "./environments";

const config = pickConfigurationFromEnvironment();

console.log({ env: process.env.NODE_ENV, config });

export default config;
