import express from "express";
import http from "node:http";
import cors from "cors";
import morganBody from "morgan-body";
import config from "../config";

export const registerMiddleware = (app: express.Application) => {
  app.use(cors({ origin: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  morganBody(app);
}

export const registerApiRoutes = (server: express.Application) => {}

export const runHttpServer = (server: http.Server) => {
  server.listen(config.port, () => {
    console.log('server listening on port', config.port);
  })
}