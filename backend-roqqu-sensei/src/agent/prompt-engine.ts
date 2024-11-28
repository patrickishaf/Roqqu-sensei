import {PromptTemplate} from "@langchain/core/prompts";
import {ChatGroq} from "@langchain/groq";

export const processPrompt = async (input: string) => {
  const rawTemplate = `
    let me know if this input ({desc}) is a crypto-related question. if it is, reply with "YES" and if it isn't, reply
    with "NO". Please note that the input must be a question. not a statement.
  `;
  const promptTemplate = new PromptTemplate({
    inputVariables: ["desc"],
    template: rawTemplate,
  });
  const llm = new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
  });
  const chain = promptTemplate.pipe(llm);
  const aiMessage = await chain.invoke({
    "desc": input
  });
  return aiMessage.content;
}