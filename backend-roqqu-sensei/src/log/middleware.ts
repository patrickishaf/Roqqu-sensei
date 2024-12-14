import { Request, Response, NextFunction } from 'express';
import { manualLogger } from './logger';
import { convertRequestToLoggable, stringifyLoggable } from './utils';

export const logRequests = (req: Request, _: Response, next: NextFunction) => {
  const requestLog = stringifyLoggable(convertRequestToLoggable(req));
  manualLogger.info(requestLog);
  next();
}
