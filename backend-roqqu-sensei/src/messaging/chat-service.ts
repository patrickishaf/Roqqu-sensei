import {Chat} from "../db";
import {generateUUID, logToConsole} from "../common";
import {Socket} from "socket.io";
import {ChatDto, ChatStatus, MessageDto} from "./dtos";
import {SocketEvent} from "../server";

export const addSocketToChatRoom = (socket: Socket, chatRoom: string) => {
  return socket.join(chatRoom);
}

export const assertChatIsNotSuspended = (chat: any) => {
  if (chat.status === ChatStatus.suspended) throw new Error('chat is currently suspended');
}

export const createChat = async (customerEmail: string) => {
  const chatModel = new Chat({
    chatRoom: generateUUID(),
    customerEmail,
    status: ChatStatus.open,
    country: 'NIGERIA',
    countryCode: 'NG',
    messages: [],
  });
  const chat = await chatModel.save();
  return chat;
}

export const deleteChatById = async (chatId: number) => {
  const result = await Chat.deleteOne({ id: chatId }).exec();
  return result.deletedCount;
}

export const getChatsByCustomer = async (customerEmail: string) => {
  const chats = await Chat.find({ customerEmail }).exec();
  return chats;
}

export const getChatById = async (chatId: string) => {
  return await Chat.findById(chatId).exec();
}

export const getMessagesInChat = async(chatId: string) => {
  const chat = await getChatById(chatId);
  return chat?.messages;
}

export const markChatAsSuspended = async (chat: ChatDto) => {
  const suspendedChat = await Chat.findOneAndUpdate({ chatRoom: chat.chatRoom }, { status: ChatStatus.suspended });
  return suspendedChat;
}

export const removeSocketFromAllChatRooms = async (socket: Socket) => {
  const user = socket.user;
  if (!user) return;

  const chatsUserIsIn = await Chat.find().select('-messages').where({ customerEmail: user.email }).exec();
  logToConsole("chats user is in:", chatsUserIsIn);
  chatsUserIsIn.forEach(chat => {
    socket.leave(chat.chatRoom!);
    logToConsole(socket.id, 'LEFT CHAT ROOM', chat.chatRoom);
  });
}

export const removeSocketFromChatRoom = async (socket: Socket, chatRoom: string) => {
  return socket.leave(chatRoom);
}

export const saveMessageToChat = async (message: MessageDto, chatId: string) => {
  const chat = await Chat.findById(chatId).exec();
  chat?.messages.push(message);
  const result = await chat?.save();
  return result;
}

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