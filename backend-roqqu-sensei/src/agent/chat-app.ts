import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver, CompiledStateGraph, StateType, StateDefinition, UpdateType,
} from '@langchain/langgraph';
import { ChatGroq } from '@langchain/groq';
import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";

const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
});

let chatApp: CompiledStateGraph<StateType<StateDefinition> | unknown extends StateDefinition ? StateType<unknown> : unknown, UpdateType<StateDefinition> | unknown extends StateDefinition ? UpdateType<unknown> : Partial<StateType<StateDefinition> | unknown extends StateDefinition ? StateType<unknown> : unknown>, typeof START | "model", StateDefinition | unknown extends StateDefinition ? unknown : StateDefinition, StateDefinition | unknown extends StateDefinition ? unknown : StateDefinition, StateDefinition>;

export const getChatApp = () => chatApp;

const createChatApp = (llm: ChatGroq) => {
  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
        You are an expert system designed to evaluate whether an input is a crypto-related question. When provided with input:
        1. If it is a question and the question is crypto-related, respond with a clear and concise answer.
        2. If not, acknowledge their effort, and give the user a response that politely explains that you focus exclusively on crypto-related topics and that encourages the user to ask a crypto-related question
        Make sure your responses are super friendly, do not add any additional context or explanation, and only reply as instructed.
        
        This is the input:
      `
    ],
    new MessagesPlaceholder("messages"),
  ]);
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const chain = promptTemplate.pipe(llm);
    const response = await chain.invoke(state);
    return { messages: [response] };
  }
  
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);
  
  const memory = new MemorySaver();
  chatApp = workflow.compile({ checkpointer: memory }) as typeof chatApp;
  return chatApp;
}

export const bootstrapChatAgent = () => {
  createChatApp(llm);
}