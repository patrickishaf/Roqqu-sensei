import {Server, Socket} from "socket.io";

export const closeChat = (io: Server, socket: Socket) => {
  return (data: any) => {
    try {} catch (err: any) {
      console.error(`failed to close chat. error: ${err.message}`);
    }
  }
}

export const processMessage = (io: Server, socket: Socket) => {
  return async (data: any) => {}
}

export const resumeChat=  (io: Server, socket: Socket) => {
  return async(data: any) => {
    try {} catch (err: any) {
      console.error(`failed to resume chat. error: ${err.message}`);
    }
  }
}

export const startChat = (io: Server, socket: Socket) => {
  return async (data: any) => {
    try {
      /**
       * 1. validate the data
       * 2. add user to chat room
       * 3. send message from bot
       */
    } catch (err: any) {
      console.error(`failed to start chat. error: ${err.message}`);
    }
  }
}