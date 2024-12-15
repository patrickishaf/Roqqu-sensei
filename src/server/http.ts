import express from "express";
import http from "node:http";
import cors from "cors";
import morganBody from "morgan-body";
import config from "../config";
import {messagingRouter, registerMessagingHandlers} from "../messaging";
import {authorizeHttpRequests} from "../auth/middleware";
import { jokesRouter, registerJokesHandlers } from "../jokes";
import { logRequests } from "../log";

export const registerMiddleware = (app: express.Express) => {
  app.use(cors({ origin: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(logRequests);
  morganBody(app);
  app.use(authorizeHttpRequests);
}

export const registerApiRoutes = (server: express.Express) => {
  registerMessagingHandlers();
  registerJokesHandlers();

  server.use('/messaging', messagingRouter);
  server.use('/jokes', jokesRouter);
}

export const runHttpServer = (server: http.Server) => {
  server.listen(config.port, () => {
    console.log('server listening on port', config.port);
  })
}