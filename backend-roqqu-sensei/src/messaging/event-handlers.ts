import {logToConsole, validateSchemaOrThrow} from "../common";
import Joi from "joi";
import { SocketEvent } from "../server";
import {Server, Socket} from "socket.io";
import {
  addSocketToChatRoom, assertChatIsNotSuspended,
  createChat,
  getChatById,
  markChatAsSuspended,
  removeSocketFromChatRoom,
  saveMessageToChat,
  sendFirstAutomatedResponse
} from "./chat-service";
import {ChatDto, MessageDto} from "./dtos";
import {processUserInputWithLLM} from "../agent";
import { addLabelAndTimestampToMessage, generateMessageFromStartChatPayload } from "./message-service";
import { UserDTO } from "auth";

export const leaveChat = (io: Server, socket: Socket) => {
  return async (data: any) => {
    try {
      const schema = Joi.object({
        chatId: Joi.string().required(),
      });
      validateSchemaOrThrow(data, schema);
      const chat = await getChatById(data.chatId);
      await markChatAsSuspended(chat as ChatDto);
      await removeSocketFromChatRoom(socket, chat?.chatRoom!);
      socket.emit(SocketEvent.leftChat, chat);
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
      validateSchemaOrThrow(incomingMessage, schema);
      if (incomingMessage.senderEmail !== socket.user?.email) {
        throw new Error(`you are not authorized to send this message. sender email mismatch`);
      }

      const chat = await getChatById(incomingMessage.chatId);
      assertChatIsNotSuspended(chat);
      addLabelAndTimestampToMessage(incomingMessage);
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

export const resumeChat = (io: Server, socket: Socket) => {
  return async(data: any) => {
    try {
      const schema = Joi.object({
        chatId: Joi.string().required(),
      });
      validateSchemaOrThrow(data, schema);
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
        message: Joi.object({
          senderEmail: Joi.string().required(),
          content: Joi.string().required(),
          isAutomated: Joi.boolean().required(),
        }).optional(),
      });
      validateSchemaOrThrow(data, schema);
      const chat = await createChat(data.email);
      await addSocketToChatRoom(socket, chat.chatRoom!);
      if (!data.message) {
        await sendFirstAutomatedResponse(socket, chat.id);
      } else {
        const userInput = await generateMessageFromStartChatPayload({
          senderEmail: data.message.senderEmail,
          content: data.message.content,
        }, socket.user!, chat.id);
        io.to(chat.chatRoom!).emit(SocketEvent.msg, userInput);
        await saveMessageToChat(userInput, chat.id);

        const reply = await processUserInputWithLLM(userInput);
        await saveMessageToChat(reply as MessageDto, chat.id);
        
        io.to(chat.chatRoom!).emit(SocketEvent.msg, reply);
      }
    } catch (err: any) {
      logToConsole(`failed to start chat. error: ${err.message}`);
      socket.emit(SocketEvent.error, err.message);
    }
  }
}