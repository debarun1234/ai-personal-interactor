import { ChatMessage } from '../types';

// Try Railway first, fallback to localhost for development
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://ai-personal-interactor-production.up.railway.app';

export interface ChatServiceResponse {
  response: string;
  sources: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    similarity_score: number;
  }>;
  processing_time: number;
}

export class RealChatService {
  static async sendMessage(
    messages: ChatMessage[],
    mode: string,
    persona: string,
    enabledPacks: string[]
  ): Promise<ChatServiceResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          mode,
          persona,
          enabled_knowledge_packs: enabledPacks,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling real chat service:', error);
      throw error;
    }
  }

  static async *streamMessage(
    messages: ChatMessage[],
    mode: string,
    persona: string,
    enabledPacks: string[]
  ): AsyncGenerator<{
    content?: string;
    sources?: any[];
    done?: boolean;
    error?: string;
  }, void, unknown> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          mode,
          persona,
          enabled_knowledge_packs: enabledPacks,
          temperature: 0.7,
          max_tokens: 1000,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              yield data;
              
              if (data.done) {
                return;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming chat service:', error);
      yield { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async searchKnowledge(
    query: string,
    topK: number = 5,
    categories: string[] = []
  ): Promise<{
    results: Array<{
      id: string;
      title: string;
      content: string;
      category: string;
      tags: string[];
      similarity_score: number;
    }>;
    total_found: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          top_k: topK,
          categories
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching knowledge:', error);
      throw error;
    }
  }

  static async getKnowledgeCategories(): Promise<{
    categories: string[];
    category_counts: Record<string, number>;
    total_items: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting knowledge categories:', error);
      throw error;
    }
  }

  static async checkBackendHealth(): Promise<{
    status: string;
    services: Record<string, boolean>;
    knowledge_items_count: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking backend health:', error);
      throw error;
    }
  }
}
