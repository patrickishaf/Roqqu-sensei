import {Server, Socket} from "socket.io";
import {SocketEvent} from "./socket-event";
import {closeChat, processMessage, resumeChat, startChat} from "../messaging";

const sampleMiddleware = (socket: Socket, next: (err?: any) => void) => {}

export const registerSocketMiddleware = (io: Server) => {
  io.use(sampleMiddleware);
}

export const registerSocketEventHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    socket.on('disconnect', () => {
      // TODO: handle disconnect event. maybe leave the chat room or something
    });

    socket.on(SocketEvent.closeChat, closeChat(io, socket));
    socket.on(SocketEvent.msg, processMessage(io, socket));
    socket.on(SocketEvent.resumeChat, resumeChat(io, socket));
    socket.on(SocketEvent.startChat, startChat(io, socket));
  });

}