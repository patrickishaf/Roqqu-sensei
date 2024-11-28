import { validateDataWithSchema } from "../common";
import Joi from "joi";
import { SocketEvent } from "../server/socket-event";
import {Server, Socket} from "socket.io";

export const closeChat = (io: Server, socket: Socket) => {
  return (data: any) => {
    try {} catch (err: any) {
      console.error(`failed to close chat. error: ${err.message}`);
      socket.emit(SocketEvent.error, err.message);
    }
  }
}

export const processMessage = (io: Server, socket: Socket) => {
  return async (data: any) => {
    try {} catch (err: any) {
      console.error(`failed to process message. error: ${err.message}`);
      socket.emit(SocketEvent.error, err.message);
    }
  }
}

export const resumeChat=  (io: Server, socket: Socket) => {
  return async(data: any) => {
    try {
      /**
       * 1. Validate data
       * 2. Ensure that the chat exists
       * 3. Ensure that the customer is a member of the chat
       * 4. Join the chat room of the chat
       */
    } catch (err: any) {
      console.error(`failed to resume chat. error: ${err.message}`);
      socket.emit(SocketEvent.error, err.message);
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
      const schema = Joi.object({});
      const errorMsg = validateDataWithSchema(data, schema);
      if (errorMsg) return socket.emit(SocketEvent.error, { fizz: 'Buzz' });
    } catch (err: any) {
      console.error(`failed to start chat. error: ${err.message}`);
      socket.emit(SocketEvent.error, err.message);
    }
  }
}