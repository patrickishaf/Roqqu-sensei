import {Server, Socket} from "socket.io";
import {closeChat, processMessage, resumeChat, startChat} from "../messaging";
import { logToConsole } from "../common";
import {authorizeSocketRequests} from "../auth/middleware";
import {removeSocketFromAllChatRooms} from "../messaging/chat-service";

export enum SocketEvent {
  msg = 'message',
  startChat = 'start_chat',
  resumeChat = 'resume_chat',
  closeChat = 'close_chat',
  chatResumed = 'chat_resumed',
  error = 'error',
  chatClosed = 'chat_closed',
  info = 'info',
}

export const registerSocketMiddleware = (io: Server) => {
  io.use(authorizeSocketRequests);
}

export const registerSocketEventHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    logToConsole('connected to the socket, SOCKET ID:', socket.id);
    socket.on('disconnect', async () => {
      logToConsole('disconnected from socket. SOCKET ID:', socket.id);
      await removeSocketFromAllChatRooms(socket);
    });

    socket.on(SocketEvent.closeChat, closeChat(io, socket));
    socket.on(SocketEvent.msg, processMessage(io, socket));
    socket.on(SocketEvent.resumeChat, resumeChat(io, socket));
    socket.on(SocketEvent.startChat, startChat(io, socket));
  });

}