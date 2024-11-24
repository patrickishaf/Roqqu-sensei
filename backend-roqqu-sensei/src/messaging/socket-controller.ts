import {Server, Socket} from "socket.io";

export const startChat = (io: Server, socket: Socket) => {
  return async (data: any) => {
    try {
      /**
       * 1. validate the data
       * 2. add user to chat room
       * 3. send message from bot
       */
    } catch (err: any) {
      console.error('failed to start chat');
    }
  }
}

export const handleNewMessage = (io: Server, socket: Socket) => {
  return async (data: any) => {}
}