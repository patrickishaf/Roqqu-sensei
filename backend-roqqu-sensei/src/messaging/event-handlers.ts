import {logToConsole, validateDataWithSchema} from "../common";
import Joi from "joi";
import { SocketEvent } from "../server";
import {Server, Socket} from "socket.io";
import {
  addSocketToChatRoom,
  createChat,
  getChatById, getMessagesInChat, removeSocketFromChatRoom,
  saveMessageToChat,
  sendFirstAutomatedResponse
} from "./chat-service";
import {MessageDto} from "./dtos";
import {processUserInputWithLLM} from "../agent";

export const closeChat = (io: Server, socket: Socket) => {
  return async (data: any) => {
    try {
      const schema = Joi.object({
        chatId: Joi.string().required(),
      });
      const errorMsg = validateDataWithSchema(data, schema);
      if (errorMsg) {
        logToConsole('failed to close chat. error:', errorMsg);
        throw new Error(errorMsg);
      }

      const chat = await getChatById(data.chatId);
      await removeSocketFromChatRoom(socket, chat?.chatRoom!);
      socket.emit(SocketEvent.chatClosed, chat);
    } catch (err: any) {
      logToConsole(`failed to close chat. error: ${err.message}`);
      socket.emit(SocketEvent.error, err.message);
    }
  }
}

export const processMessage = (io: Server, socket: Socket) => {
  return async (incomingMessage: MessageDto) => {
    try {
      const schema = Joi.object({
        chatId: Joi.string().required(),
        senderEmail: Joi.string().required(),
        content: Joi.string().required(),
        isAutomated: Joi.boolean().required(),
      });
      const errorMsg = validateDataWithSchema(incomingMessage, schema);
      if (errorMsg) {
        logToConsole('failed to process message chat. error:', errorMsg);
        throw new Error(`failed to send message. error: ${errorMsg}`);
      }

      if (incomingMessage.senderEmail !== socket.user?.email) {
        throw new Error(`you are not authorized to send this message. sender email mismatch`);
      }
      const chat = await getChatById(incomingMessage.chatId);
      io.to(chat?.chatRoom!).emit(SocketEvent.msg, incomingMessage);
      await saveMessageToChat(incomingMessage, chat?.id);

      const automatedReply = await processUserInputWithLLM(incomingMessage);
      await saveMessageToChat(automatedReply as MessageDto, chat?.id);
      io.to(chat?.chatRoom!).emit(SocketEvent.msg, automatedReply);
    } catch (err: any) {
      logToConsole(`failed to process message. error: ${err.message}`);
      socket.emit(SocketEvent.error, err.message);
    }
  }
}

export const resumeChat=  (io: Server, socket: Socket) => {
  return async(data: any) => {
    try {
      const schema = Joi.object({
        chatId: Joi.string().required(),
      });
      const errorMsg = validateDataWithSchema(data, schema);
      if (errorMsg) {
        logToConsole(`failed to resume chat. error: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const existingChat = await getChatById(data.chatId);
      if (socket.user?.email !== existingChat?.customerEmail) {
        logToConsole(`failed to resume chat. user with email ${socket.user?.email} is not a member of this chat`);
        throw new Error('you are not a member of the chat you are trying to resume');
      }

      addSocketToChatRoom(socket, existingChat?.chatRoom!);
      socket.emit(SocketEvent.chatResumed, existingChat);
    } catch (err: any) {
      logToConsole(`failed to resume chat. error: ${err.message}`);
      socket.emit(SocketEvent.error, 'failed to resume chat');
    }
  }
}

export const startChat = (io: Server, socket: Socket) => {
  return async (data: any) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
      });
      const errorMsg = validateDataWithSchema(data, schema);
      if (errorMsg) {
        logToConsole(`bad request. failed to start chat. error: ${errorMsg}`);
        return socket.emit(SocketEvent.error, errorMsg);
      }

      const chat = await createChat(data.email);
      await addSocketToChatRoom(socket, chat.chatRoom!);
      await sendFirstAutomatedResponse(socket, chat.id);
    } catch (err: any) {
      logToConsole(`failed to start chat. error: ${err.message}`);
      socket.emit(SocketEvent.error, err.message);
    }
  }
}