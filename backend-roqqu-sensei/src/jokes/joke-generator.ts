import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";

export const generateJokes = async (count: number = 10) => {
  const model = new ChatGroq({
    model: 'mixtral-8x7b-32768',
    temperature: 0,
  });
  
  const messages = [
    new SystemMessage('Act as a standup comedian with a witty sense of humor. Focus on providing short jokes (not more than 160 characters long) that are crypto-related. Do not provide jokes that are not crypto-related. Provide the exact amount of jokes I specify. Return the jokes in a numbered format'),
    new HumanMessage(`What are ${count} witty jokes?`),
  ];

  const parser = new StringOutputParser();

  const chain = model.pipe(parser);
  const result = await chain.invoke(messages);
  console.log('result =>', result);
  return result;
}

export const convertJokesResponseToStringArray = (jokesResponse: string) => {
  const jokesArray = jokesResponse.split('\n');
  return jokesArray;
};