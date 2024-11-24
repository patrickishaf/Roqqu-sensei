import express from 'express';
import http from 'node:http';
import {Server} from "socket.io";
import {registerApiRoutes, registerMiddleware, runHttpServer} from "./http";
import {registerSocketEventHandlers, registerSocketMiddleware} from "./socket";

const app = express();

export const httpServer = http.createServer(app);
export const socketServer: Server = new Server(httpServer, { cors: { origin: true }});

export const bootstrapApplication = () => {
  registerMiddleware(app);
  registerApiRoutes(app);
  registerSocketMiddleware(socketServer);
  registerSocketEventHandlers(socketServer);
  runHttpServer(httpServer);
}