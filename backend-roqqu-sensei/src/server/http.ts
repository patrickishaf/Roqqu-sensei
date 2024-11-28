import express from "express";
import http from "node:http";
import cors from "cors";
import morganBody from "morgan-body";
import config from "../config";
import {messagingRouter} from "../messaging/request-handlers";
import {authorizeHttpRequests} from "../auth/middleware";

export const registerMiddleware = (app: express.Express) => {
  app.use(cors({ origin: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  morganBody(app);
  // @ts-ignore
  app.use(authorizeHttpRequests);
}

export const registerApiRoutes = (server: express.Express) => {
  server.use('/messaging', messagingRouter);
}

export const runHttpServer = (server: http.Server) => {
  server.listen(config.port, () => {
    console.log('server listening on port', config.port);
  })
}