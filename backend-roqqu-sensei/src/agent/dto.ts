export interface LLMInput {
  role: 'user' | 'assistant';
  content: string;
}

export type LLMInvokeParams = LLMInput[];