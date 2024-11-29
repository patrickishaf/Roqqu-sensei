import {PromptTemplate} from "@langchain/core/prompts";
import {ChatGroq} from "@langchain/groq";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { MessageDto } from "messaging/dtos";
import { convertAIMessageChunkToMessageDTO, convertMessagesToLLMInput } from "./agent-service";

// export const processPrompt = async (input: string) => {
//   const rawTemplate = `
//     You are an expert system designed to evaluate whether an input is a crypto-related question. When provided with input:
//     1. If it is a crypto-related question, respond with a clear and concise answer.
//     2. If it is not a crypto-related question, respond with just the word NO.
//     Do not add any additional context or explanation. Only reply as instructed.
    
//     This is the input: "{desc}"
//   `;
//   const promptTemplate = new PromptTemplate({
//     inputVariables: ["desc"],
//     template: rawTemplate,
//   });
//   const llm = new ChatGroq({
//     model: "mixtral-8x7b-32768",
//     temperature: 0,
//   });
//   const chain = promptTemplate.pipe(llm);
//   const aiMessage = await chain.invoke({
//     "desc": input
//   });
//   return aiMessage.content;
// }

export const processUserInputWithLLM = async (messages: MessageDto[]) => {
  const data = convertMessagesToLLMInput(messages);
  const llm = new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0,
  });
  const result = await llm.invoke(data as BaseLanguageModelInput);
  return convertAIMessageChunkToMessageDTO(result);
}