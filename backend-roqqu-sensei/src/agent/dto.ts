export interface LLMInput {
  role: 'user' | 'assistant';
  content: string;
}