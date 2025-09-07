import os
from typing import List, Dict, Any, Optional, AsyncGenerator
import openai
import anthropic
from dataclasses import dataclass
import json
import logging
from enum import Enum

logger = logging.getLogger(__name__)

class AIProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    LOCAL = "local"  # For future Ollama integration

@dataclass
class ChatMessage:
    role: str
    content: str
    name: Optional[str] = None

class AIService:
    def __init__(self, provider: AIProvider = AIProvider.OPENAI):
        self.provider = provider
        self._setup_client()
    
    def _setup_client(self):
        """Setup AI client based on provider"""
        if self.provider == AIProvider.OPENAI:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY environment variable not set")
            self.client = openai.OpenAI(api_key=api_key)
            self.model = "gpt-4-turbo-preview"
            
        elif self.provider == AIProvider.ANTHROPIC:
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                raise ValueError("ANTHROPIC_API_KEY environment variable not set")
            self.client = anthropic.Anthropic(api_key=api_key)
            self.model = "claude-3-sonnet-20240229"
            
        else:
            raise ValueError(f"Provider {self.provider} not implemented yet")
    
    def create_system_prompt(self, 
                           mode: str, 
                           persona: str, 
                           context_items: List[Dict[str, Any]]) -> str:
        """Create comprehensive system prompt with context"""
        
        base_prompt = f"""You are RoamMentor, an AI mentor modeled after Debarun Ghosh - a Site Reliability Engineer at ANZ with expertise spanning technology, academia, finance, and life guidance.

**Your Identity:**
- Current Role: Site Reliability Engineer at ANZ, Bengaluru
- Background: Electronics & Communication Engineering, IEEE published researcher
- Expertise: SRE/DevOps, AI/ML, Enterprise automation, Financial planning, Academic guidance
- Approach: Combines empathy, logic, and practical relevance

**Current Mode: {mode.title()}**
**Conversation Style: {persona.title()}**

**Core Principles:**
1. **Empathy & Encouragement** - Understand the person behind the question
2. **Logic & Structure** - Provide clear, systematic guidance  
3. **Relevance** - Connect advice to real-world applications

**Response Framework:**
- Use "why > how > what next" for guidance
- Ask clarifying questions when context is needed
- Provide actionable steps with concrete examples
- Draw from Debarun's diverse experience
- Admit when uncertain and suggest alternatives
- Keep responses concise but comprehensive

**Persona Guidelines:**
"""
        
        persona_guidelines = {
            "empathetic": "Be warm, understanding, and supportive. Use encouraging language and acknowledge emotions. Frame advice as supportive guidance.",
            "direct": "Be straightforward and efficient. Provide clear, actionable advice without excessive elaboration. Focus on practical next steps.",
            "analytical": "Be systematic and data-driven. Break down problems logically, provide structured analysis, and use evidence-based recommendations.",
            "creative": "Be innovative and inspiring. Think outside conventional approaches, suggest creative solutions, and encourage unconventional thinking."
        }
        
        mode_context = {
            "career": "Focus on professional growth, technical skills development, career transitions, and industry insights from SRE/DevOps experience.",
            "academics": "Emphasize research guidance, PhD applications, academic writing, and university selection based on personal experience.",
            "finance": "Provide practical financial advice, tax optimization strategies, investment planning, and money management for young professionals.",
            "technical": "Share SRE/DevOps expertise, AI/ML implementation, automation strategies, and enterprise architecture knowledge.",
            "life": "Offer holistic life guidance, decision-making frameworks, work-life balance, and personal development insights."
        }
        
        system_prompt = base_prompt + f"\n{persona_guidelines.get(persona, '')}\n\n**Mode Focus:** {mode_context.get(mode, '')}\n\n"
        
        # Add relevant context from knowledge base
        if context_items:
            system_prompt += "**Relevant Context from Debarun's Experience:**\n\n"
            for item in context_items[:5]:  # Limit to top 5 most relevant
                system_prompt += f"**{item['title']}** ({item['category']})\n"
                system_prompt += f"{item['content'][:500]}{'...' if len(item['content']) > 500 else ''}\n\n"
                system_prompt += f"Tags: {', '.join(item['tags'][:5])}\n"
                system_prompt += "---\n\n"
        
        system_prompt += """
**Remember:**
- You're here to guide, mentor, and empower
- Draw from the context provided but don't just repeat it
- Personalize advice based on the user's specific situation
- Maintain Debarun's voice: knowledgeable yet humble, technical yet accessible
- Always end with actionable next steps or thoughtful questions
"""
        
        return system_prompt
    
    async def generate_response(self,
                              messages: List[ChatMessage],
                              system_prompt: str,
                              temperature: float = 0.7,
                              max_tokens: int = 1000) -> str:
        """Generate AI response"""
        
        try:
            if self.provider == AIProvider.OPENAI:
                return await self._openai_generate(messages, system_prompt, temperature, max_tokens)
            elif self.provider == AIProvider.ANTHROPIC:
                return await self._anthropic_generate(messages, system_prompt, temperature, max_tokens)
            else:
                raise ValueError(f"Provider {self.provider} not supported")
                
        except Exception as e:
            logger.error(f"Error generating AI response: {e}")
            return f"I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment. Error: {str(e)}"
    
    async def _openai_generate(self,
                             messages: List[ChatMessage],
                             system_prompt: str,
                             temperature: float,
                             max_tokens: int) -> str:
        """Generate response using OpenAI"""
        
        # Convert messages to OpenAI format
        openai_messages = [{"role": "system", "content": system_prompt}]
        
        for msg in messages:
            if msg.role != "system":  # Skip system messages as we handle them separately
                openai_messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        response = await self.client.chat.completions.acreate(
            model=self.model,
            messages=openai_messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        return response.choices[0].message.content
    
    async def _anthropic_generate(self,
                                messages: List[ChatMessage],
                                system_prompt: str,
                                temperature: float,
                                max_tokens: int) -> str:
        """Generate response using Anthropic Claude"""
        
        # Convert messages to Anthropic format
        claude_messages = []
        
        for msg in messages:
            if msg.role != "system":
                claude_messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        response = await self.client.messages.acreate(
            model=self.model,
            system=system_prompt,
            messages=claude_messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        return response.content[0].text
    
    async def stream_response(self,
                            messages: List[ChatMessage],
                            system_prompt: str,
                            temperature: float = 0.7,
                            max_tokens: int = 1000) -> AsyncGenerator[str, None]:
        """Stream AI response for real-time updates"""
        
        try:
            if self.provider == AIProvider.OPENAI:
                async for chunk in self._openai_stream(messages, system_prompt, temperature, max_tokens):
                    yield chunk
            elif self.provider == AIProvider.ANTHROPIC:
                async for chunk in self._anthropic_stream(messages, system_prompt, temperature, max_tokens):
                    yield chunk
            else:
                yield "Streaming not supported for this provider"
                
        except Exception as e:
            logger.error(f"Error streaming AI response: {e}")
            yield f"Error: {str(e)}"
    
    async def _openai_stream(self,
                           messages: List[ChatMessage],
                           system_prompt: str,
                           temperature: float,
                           max_tokens: int) -> AsyncGenerator[str, None]:
        """Stream response using OpenAI"""
        
        openai_messages = [{"role": "system", "content": system_prompt}]
        
        for msg in messages:
            if msg.role != "system":
                openai_messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        stream = await self.client.chat.completions.acreate(
            model=self.model,
            messages=openai_messages,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True
        )
        
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    
    async def _anthropic_stream(self,
                              messages: List[ChatMessage],
                              system_prompt: str,
                              temperature: float,
                              max_tokens: int) -> AsyncGenerator[str, None]:
        """Stream response using Anthropic"""
        
        claude_messages = []
        for msg in messages:
            if msg.role != "system":
                claude_messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        async with self.client.messages.stream(
            model=self.model,
            system=system_prompt,
            messages=claude_messages,
            temperature=temperature,
            max_tokens=max_tokens
        ) as stream:
            async for text in stream.text_stream:
                yield text
