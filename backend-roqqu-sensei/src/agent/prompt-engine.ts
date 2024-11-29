import { MessageDto } from "messaging/dtos";
import {
  convertAIMessageChunkToMessageDTO,
  convertSingleMessageToLLMInput, createConfigFromChatId
} from "./agent-service";
import {getChatApp} from "./chat-app";

export const processUserInputWithLLM = async (message: MessageDto) => {
  const llmInput = convertSingleMessageToLLMInput(message);
  const config = createConfigFromChatId(message.chatId);
  const output = await getChatApp().invoke({ messages: llmInput }, config);
  const latestMessage = output.messages[output.messages.length - 1];
  return convertAIMessageChunkToMessageDTO(latestMessage);
}