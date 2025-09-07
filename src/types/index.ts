export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

export interface Citation {
  title: string;
  url?: string;
  snippet?: string;
}

export interface KnowledgePack {
  key: string;
  label: string;
  description: string;
  icon: string;
  content: KnowledgeItem[];
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  type: 'experience' | 'technical' | 'research' | 'personal' | 'advice';
}

export interface MentorMode {
  key: string;
  label: string;
  description: string;
  icon: string;
  systemPrompt: string;
  suggestedQuestions: string[];
}

export interface MentorPersona {
  key: string;
  label: string;
  description: string;
  traits: string[];
}

export interface ChatConfig {
  mode: string;
  persona: string;
  temperature: number;
  enabledKnowledgePacks: string[];
  enableSearchMode: boolean;
}
