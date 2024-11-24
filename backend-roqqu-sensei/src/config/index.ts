import {getConfig} from "./environments";

const config = getConfig();

console.log({ env: process.env.NODE_ENV, config });

export default config;
