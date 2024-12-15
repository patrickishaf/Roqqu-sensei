import {Server, Socket} from "socket.io";
import {leaveChat, processMessage, resumeChat, startChat} from "../messaging";
import { logToConsole } from "../common";
import {authorizeSocketRequests} from "../auth/middleware";
import {removeSocketFromAllChatRooms} from "../messaging/chat-service";

export enum SocketEvent {
  chatResumed = 'chat_resumed',
  error = 'error',
  info = 'info',
  leaveChat = 'leave_chat',
  leftChat = 'left_chat',
  msg = 'message',
  resumeChat = 'resume_chat',
  startChat = 'start_chat',
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

    socket.on(SocketEvent.leaveChat, leaveChat(io, socket));
    socket.on(SocketEvent.msg, processMessage(io, socket));
    socket.on(SocketEvent.resumeChat, resumeChat(io, socket));
    socket.on(SocketEvent.startChat, startChat(io, socket));
  });

}