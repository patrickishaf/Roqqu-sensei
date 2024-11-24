import {Request, Response, NextFunction} from "express";
import {Socket} from "socket.io";

export const authorizeHttpRequests = (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Call middleware methods
  } catch (err: any) {
    // TODO: If an error is thrown, do not authenticate
  }
}

export const authorizeSocketRequests = (socket: Socket, next: (err?: any) => void) => {
  try {
    // TODO: Call middleware methods
  } catch (err: any) {
    // TODO: If an error is thrown, do not authenticate
  }
}