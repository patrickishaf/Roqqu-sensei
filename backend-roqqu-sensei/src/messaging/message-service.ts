import { convertWordToTitleCase } from '../common';
import { findUserByEmail, UserDTO } from '../auth';
import { MessageDto } from "./dtos"

export const addLabelAndTimestampToMessage = async (message: Partial<MessageDto>, userData?: UserDTO) => {
  message.timestamp = new Date();
  const user = await findUserByEmail(message.senderEmail!);
  message.labelText = `${user.firstName ?? ''} ${user.lastName ?? ''}`;
}

const generateLabelFromUser = async (data: UserDTO) => {
  const { firstName, lastName } = data;
  if (firstName && lastName) {
    return convertWordToTitleCase(firstName) + ' ' + convertWordToTitleCase(lastName);
  }
  const user = await findUserByEmail(data.email!);
  return convertWordToTitleCase(user.firstName ?? '') + ' ' + convertWordToTitleCase(user.lastName ?? '');
}

export const generateMessageFromStartChatPayload = async (payload: Partial<MessageDto>, sender: UserDTO, chatId: string) => {
  const labelText = await generateLabelFromUser(sender);
  const userInput: MessageDto = {
    chatId,
    content: payload.content!,
    isAutomated: false,
    labelText: labelText,
    senderEmail: payload.senderEmail!,
    timestamp: new Date(),
  }
  return userInput;
}

export const getMessagesInChat = async (chatId: number): Promise<any> => {}

export const getMessageById = async (messageId: number): Promise<any> => {}