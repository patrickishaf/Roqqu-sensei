import express from 'express';
import http from 'node:http';
import {Server} from "socket.io";

const app = express();

export const httpServer = http.createServer(app);
export const socketServer: Server = new Server(httpServer, { cors: { origin: true }});

export const configureHttpServer = (server: express.Application)=> {}

export const registerMiddleware = (server: express.Application) => {}

export const registerApiRoutes = (server: express.Application) => {}