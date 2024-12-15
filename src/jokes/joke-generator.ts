import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

export const generateJokes = async (count: number = 10) => {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
  });
  
  const messages = [
    new SystemMessage('Act as a standup comedian with a witty sense of humor. Focus on providing random short jokes (not more than 160 characters long and emphasis on "random") that are crypto-related. Do not provide jokes that are not crypto-related Provide the exact amount of jokes I specify. Return the jokes in a numbered format'),
    new HumanMessage(`Generate ${count} random witty jokes?`),
  ];

  const parser = new StringOutputParser();

  const chain = model.pipe(parser);
  const result = await chain.invoke(messages);
  console.log('result =>', result);
  return result;
}

export const convertJokesResponseToStringArray = (jokesResponse: string) => {
  const jokesArray = jokesResponse.split('\n');
  return jokesArray.map((joke) => removeNumberFromJoke(joke));
};

export const removeNumberFromJoke = (joke: string) => {
  const indexOfPeriod = joke.indexOf('.');
  if (indexOfPeriod === -1) return joke;
  if (joke.charAt(indexOfPeriod + 1) === ' ') {
    return joke.substring(indexOfPeriod + 2)
  } else {
    return joke.substring(indexOfPeriod + 1);
  }
}