import {Chat} from "../db";
import {generateUUID, logToConsole} from "../common";
import {Socket} from "socket.io";
import {ChatStatus} from "./utils";
import {MessageDto} from "./dtos";
import {SocketEvent} from "../server/socket-event";

export const addSocketToChatRoom = (socket: Socket, chatRoom: string) => {
  return socket.join(chatRoom);
}

export const createChat = async (customerEmail: string) => {
  const chatRoom = generateUUID();
  const chatModel = new Chat({
    chatRoom: chatRoom,
    customerEmail,
    status: ChatStatus.OPEN,
    country: "NIGERIA",
    countryCode: "NG",
    messages: [],
  });
  const chat = await chatModel.save();
  return chat;
}

export const deleteChatById = async (chatId: number) => {}

export const getChatsByCustomer = async (customerEmail: string) => {
  const chats = await Chat.find({ customerEmail }).exec();
  return chats;
}

export const getChatById = async (chatId: number) => {}

export const sendFirstAutomatedResponse = async (socket: Socket, chatId: string) => {
  const automatedMessage: MessageDto = {
    chatId,
    content: `Hi ${(socket as any).user.firstName}, what would you like to know about crypto today`,
    isAutomated: true,
    labelText: 'Roqqu Sensei',
    timestamp: new Date(),
  };
  await saveMessageToChat(automatedMessage, chatId);
  socket.emit(SocketEvent.msg, automatedMessage);
}

export const saveMessageToChat = async (message: MessageDto, chatId: string) => {
  // TODO: Add a message to the messages array of a chat object
  const chat = await Chat.findById(chatId).exec();
  chat?.messages.push(message);
  const result = await chat?.save();
  logToConsole(`saved message ${message} to chat ${chat}`);
  return result;
}