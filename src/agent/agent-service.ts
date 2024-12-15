import { AIMessageChunk } from "@langchain/core/messages";
import {LLMInput} from "./dto";
import { MessageDto } from "messaging/dtos";


export const convertSingleMessageToLLMInput = (message: MessageDto) => {
  const { isAutomated, content } = message;
  return ({
    role: isAutomated ? 'assistant' : 'user',
    content,
  }) as LLMInput;
}

export const convertAIMessageChunkToMessageDTO = (chunk: AIMessageChunk) => {
  const msg: Partial<MessageDto> = {
    content: chunk.content as string,
    isAutomated: true,
    labelText: 'Roqqu Sensei',
    timestamp: new Date(),
  };
  return msg;
}

export const createConfigFromChatId = (chatId: string) => {
  return ({
    configurable: {
      thread_id: chatId
    }
  });
}
