export interface FaqItem {
  category: string;
  question: string;
  answer: string;
  tags?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
