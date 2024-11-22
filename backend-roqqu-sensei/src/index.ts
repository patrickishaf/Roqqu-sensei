import express from "express";
import cors from "cors";
import { Server} from "socket.io";
import http from "node:http";

const app = express();
const httpServer = http.createServer(app)