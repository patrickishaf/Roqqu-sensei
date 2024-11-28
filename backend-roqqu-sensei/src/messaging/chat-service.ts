import {Chat} from "../db";

export const getChatsByCustomer = async (customerEmail: string) => {
  const chats = await Chat.find({ customerEmail }).exec();
  return chats;
}

export const getChatById = async (chatId: number) => {}

export const deleteChatById = async (chatId: number) => {}