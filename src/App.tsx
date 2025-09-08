import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Settings, 
  Brain,
  Loader2,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { LoadingScreen } from './components/LoadingScreen';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { DarkModeToggle } from './components/DarkModeToggle';
import { ChatMessage as ChatMessageType, ChatConfig } from './types';
import { MENTOR_MODES, MENTOR_PERSONAS, KNOWLEDGE_PACKS, DEFAULT_SYSTEM_PROMPT } from './data/mentorConfig';
import { MockChatService } from './services/chatService';
import { RealChatService } from './services/realChatService';

const App: React.FC = () => {
  // Chat state
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      role: 'system',
      content: DEFAULT_SYSTEM_PROMPT,
      timestamp: new Date()
    },
    {
      id: '2', 
      role: 'assistant',
      content: `🌟 Welcome to AskRick! 🌟

I'm Debarun, your AI Buddy. I'm here to help you navigate life's challenges using my expertise and experience in:

💼 Career & Professional Growth
🎓 Academic Journey & Research 
💰 Financial Planning & Investments
⚙️ Technical Skills & SRE/DevOps
🌟 Life Guidance & Personal Development

What's on your mind? Share what you're working on or what challenges you're facing, and I'll help you find the best path forward.

Tip: Use the settings to customize our conversation style and focus areas!`,
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  // Chat configuration
  const [config, setConfig] = useState<ChatConfig>({
    mode: 'life',
    persona: 'empathetic',
    temperature: 0.7,
    enabledKnowledgePacks: ['personal'],
    enableSearchMode: true
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Check backend status periodically
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        setIsBackendOnline(response.ok);
      } catch {
        setIsBackendOnline(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response: string;
      let sources: any[] = [];

      if (isBackendOnline) {
        // Use real backend service
        const result = await RealChatService.sendMessage(
          [...messages, userMessage],
          config.mode,
          config.persona,
          config.enabledKnowledgePacks
        );
        response = result.response;
        sources = result.sources || [];
      } else {
        // Fallback to mock service
        response = await MockChatService.sendMessage(
          [...messages, userMessage],
          config.mode,
          config.persona,
          config.enabledKnowledgePacks
        );
      }

      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        citations: sources.map(source => ({
          title: source.title,
          snippet: source.content.substring(0, 100) + '...'
        }))
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleKnowledgePack = (packKey: string) => {
    setConfig(prev => ({
      ...prev,
      enabledKnowledgePacks: prev.enabledKnowledgePacks.includes(packKey)
        ? prev.enabledKnowledgePacks.filter(k => k !== packKey)
        : [...prev.enabledKnowledgePacks, packKey]
    }));
  };

  const currentMode = MENTOR_MODES.find(m => m.key === config.mode) || MENTOR_MODES[0];

  const handleLoadingComplete = () => {
    setIsAppLoading(false);
  };

  return (
    <DarkModeProvider>
      {isAppLoading ? (
        <LoadingScreen 
          onLoadingComplete={handleLoadingComplete}
          backendStatus={{
            isOnline: isBackendOnline,
            knowledgeItems: config.enabledKnowledgePacks.length * 50 // Estimate based on enabled packs
          }}
        />
      ) : (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AskRick</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Your AI Buddy</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Conversation Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mentoring Focus
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {MENTOR_MODES.map(mode => (
                <button
                  key={mode.key}
                  onClick={() => setConfig(prev => ({ ...prev, mode: mode.key }))}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    config.mode === mode.key
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  title={mode.description}
                >
                  <span className="text-lg">{mode.icon}</span>
                  <div className="text-xs mt-1">{mode.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Persona Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Conversation Style
            </label>
            <select
              value={config.persona}
              onChange={(e) => setConfig(prev => ({ ...prev, persona: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {MENTOR_PERSONAS.map(persona => (
                <option key={persona.key} value={persona.key}>
                  {persona.label} - {persona.description}
                </option>
              ))}
            </select>
          </div>

          {/* Knowledge Packs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Knowledge Areas
            </label>
            <div className="flex flex-wrap gap-2">
              {KNOWLEDGE_PACKS.map(pack => (
                <button
                  key={pack.key}
                  onClick={() => toggleKnowledgePack(pack.key)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    config.enabledKnowledgePacks.includes(pack.key)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                  title={pack.description}
                >
                  <span>{pack.icon}</span>
                  {pack.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.filter(m => m.role !== 'system').map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 rounded-bl-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">💡 Try asking...</p>
              {showSuggestions ? (
                <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              )}
            </button>
            
            {showSuggestions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentMode.suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about career, academics, finance, technology, or life guidance..."
                className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[48px] max-h-32"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                {config.enabledKnowledgePacks.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Sparkles className="w-3 h-3" />
                    <span>{config.enabledKnowledgePacks.length}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>
              {currentMode.label} mode • {config.enabledKnowledgePacks.length} knowledge areas • 
              {isBackendOnline ? ' Full AI Mode' : ' Beta Testing'}
            </span>
          </div>
        </div>
      </div>
    </div>
        )}
    </DarkModeProvider>
  );
};

export default App;
