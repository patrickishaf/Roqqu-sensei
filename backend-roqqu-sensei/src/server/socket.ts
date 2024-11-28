import {Server, Socket} from "socket.io";
import {SocketEvent} from "./socket-event";
import {closeChat, processMessage, resumeChat, startChat} from "../messaging";
import { logToConsole } from "../common";
import {authorizeSocketRequests} from "../auth/middleware";

export const registerSocketMiddleware = (io: Server) => {
  io.use(authorizeSocketRequests);
}

export const registerSocketEventHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    logToConsole('connected to the socket, SOCKET ID:', socket.id);
    socket.on('disconnect', () => {
      logToConsole('disconnected from socket. SOCKET ID:', socket.id);
      // TODO: handle disconnect event. maybe leave the chat room or something
    });

    socket.on(SocketEvent.closeChat, closeChat(io, socket));
    socket.on(SocketEvent.msg, processMessage(io, socket));
    socket.on(SocketEvent.resumeChat, resumeChat(io, socket));
    socket.on(SocketEvent.startChat, startChat(io, socket));
  });

}