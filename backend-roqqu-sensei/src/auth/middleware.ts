import {Request, Response, NextFunction} from "express";
import {Socket} from "socket.io";
import {getUserFromToken} from "./authservice";
import {HttpStatusCode} from "axios";
import {createErrorResponse, logToConsole} from "../common";
import {UserDTO} from "./dto";
import { manualLogger } from "../log";

export const authorizeHttpRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      manualLogger.error('no auth header present in http request');
      throw new Error("no auth header present");
    }
    const [_, token] = authHeader.split(" ");
    if (!token) {
      manualLogger.error('no token present in http request');
      throw new Error("no token present");
    }
    const user = await getUserFromToken(token);
    if (!user) {
      manualLogger.error('failed to authenticate user');
      throw new Error('failed to authenticate user');
    }

    req.user = user as UserDTO;
    next();
  } catch (err: any) {
    manualLogger.error(`failed to authenticate http Request. error: ${err.message}`);
    res.status(HttpStatusCode.Unauthorized).json(createErrorResponse(err.message));
  }
}

export const authorizeSocketRequests = async (socket: Socket, next: (err?: any) => void) => {
  try {
    const token = (socket.handshake.query.token ?? socket.handshake.auth.token) as string;
    if (!token) {
      manualLogger.error('no token present in socket request');
      return next(new Error('no token present'));
    }
    const user = await getUserFromToken(token);
    if (!user) {
      manualLogger.error('failed to authenticate user in socket request');
      return next(new Error('failed to authenticate user'));
    }

    socket.user = user as UserDTO;
    next();
  } catch (err: any) {
    // TODO: If an error is thrown, do not authenticate
    manualLogger.error(`failed to authenticate socket connection. error: ${err.message}`);
    next(new Error(err.message));
  }
}