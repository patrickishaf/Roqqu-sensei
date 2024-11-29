import { AIMessageChunk } from "@langchain/core/messages";
import { LLMInvokeParams } from "./dto";
import { MessageDto } from "messaging/dtos";

export const convertMessagesToLLMInput = (messages: MessageDto[]) => {
  const input: LLMInvokeParams = messages.map(({isAutomated, content}) => ({
    role: isAutomated ? 'assistant' : 'user',
    content,
  }));
  return input;
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