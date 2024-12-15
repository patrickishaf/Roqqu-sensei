import {Request} from 'express';

export interface Loggable {
  timestamp: Date;
  method: string;
  baseUrl: string;
  urlPath: string;
  originalUrl: string;
  body?: string;
  query?: string;
  ipAddress?: string;
  ipAddresses: string[];
  hostName: string;
}

export const convertRequestToLoggable = (request: Request) => {
  const loggable: Loggable = {
    timestamp: new Date(),
    method: request.method,
    baseUrl: request.baseUrl,
    urlPath: request.path,
    originalUrl: request.originalUrl,
    body: request.body,
    query: JSON.stringify(request.query),
    ipAddress: request.ip,
    ipAddresses: request.ips,
    hostName: request.hostname,
  };
  return loggable
}

export const stringifyLoggable = (loggable: Loggable) => JSON.stringify(loggable);