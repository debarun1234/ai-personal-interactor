import Fuse from 'fuse.js';
import { KnowledgeItem, ChatMessage } from '../types';
import { knowledgeBase } from '../data/knowledgeBase';

// Initialize Fuse.js for semantic search
const fuse = new Fuse(knowledgeBase, {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'content', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true
});

export class KnowledgeSearchService {
  static searchKnowledge(query: string, limit: number = 5): KnowledgeItem[] {
    const results = fuse.search(query, { limit });
    return results.map(result => result.item);
  }

  static getKnowledgeByCategory(category: string): KnowledgeItem[] {
    return knowledgeBase.filter(item => item.category === category);
  }

  static getKnowledgeByTags(tags: string[]): KnowledgeItem[] {
    return knowledgeBase.filter(item => 
      tags.some(tag => item.tags.includes(tag))
    );
  }

  static generateContextFromKnowledge(items: KnowledgeItem[]): string {
    if (items.length === 0) return '';
    
    return items.map(item => `
${item.title} (${item.category})
${item.content}
Tags: ${item.tags.join(', ')}
`).join('\n---\n');
  }

  static extractRelevantContext(userMessage: string, enabledPacks: string[]): string {
    // Search for relevant knowledge based on user message
    const relevantItems = this.searchKnowledge(userMessage, 3);
    
    // Filter by enabled knowledge packs if specified
    const filteredItems = enabledPacks.length > 0 
      ? relevantItems.filter(item => enabledPacks.includes(item.category))
      : relevantItems;
    
    return this.generateContextFromKnowledge(filteredItems);
  }
}

export class MockChatService {
  static async sendMessage(
    messages: ChatMessage[],
    mode: string,
    persona: string,
    enabledPacks: string[]
  ): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const userMessage = messages[messages.length - 1]?.content || '';
    const context = KnowledgeSearchService.extractRelevantContext(userMessage, enabledPacks);
    
    // Generate a response based on the mode and context
    return this.generateMockResponse(userMessage, mode, persona, context);
  }

  private static generateMockResponse(
    userMessage: string, 
    mode: string, 
    persona: string, 
    context: string
  ): string {
    // Handle casual greetings and simple questions
    const casualGreetings = /^(hi|hello|hey|how are you|how are|what's up|sup|good morning|good afternoon|good evening)\??!*$/i;
    const thankYou = /^(thanks|thank you|ty|thx)\??!*$/i;
    
    if (casualGreetings.test(userMessage.trim())) {
      return this.generateGreetingResponse();
    }
    
    if (thankYou.test(userMessage.trim())) {
      return this.generateThankYouResponse();
    }

    const modeResponses = {
      career: this.generateCareerResponse(userMessage, persona, context),
      academics: this.generateAcademicResponse(userMessage, persona, context),
      finance: this.generateFinanceResponse(userMessage, persona, context),
      technical: this.generateTechnicalResponse(userMessage, persona, context),
      life: this.generateLifeResponse(userMessage, persona, context)
    };

    return modeResponses[mode as keyof typeof modeResponses] || this.generateGeneralResponse(userMessage, persona);
  }

  private static generateGreetingResponse(): string {
    // Use the same friendly response as the backend
    return `Hey there! 👋 I'm doing great, thanks for asking! 

🔧 I'm currently in beta testing mode - think of me as Debarun's AI buddy who's still getting his coffee and warming up the brain circuits! ☕🤖

I'm excited to chat with you about:
🚀 Career & Tech • 🎓 Academic Journey • 💰 Financial Planning • ⚙️ Technical Skills • 🌟 Life Guidance

What's on your mind today? I'd love to help you explore any of these areas! 😊`;
  }

  private static generateThankYouResponse(): string {
    // Use the same friendly response as the backend
    return `You're so welcome! 😊 

That's what I'm here for - helping awesome people like you navigate life's challenges and opportunities!

Feel free to ask me anything else about career moves, academic planning, tech skills, financial strategies, or just life in general. I've got tons of knowledge ready to share! 🌟

What else can we explore together? ☕`;
  }

  private static generateCareerResponse(_userMessage: string, persona: string, context: string): string {
    const baseResponse = `Based on my experience transitioning from academia to industry and working as an SRE at ANZ, here's my perspective:

Why this matters: Career decisions shape not just your professional growth but your entire life trajectory. The tech industry, especially SRE and AI roles, requires both technical depth and strategic thinking.

How to approach it: 
1. Skill Development: Focus on cloud-native technologies, automation, and AI integration
2. Practical Experience: Build projects that demonstrate real-world problem-solving
3. Network Building: Connect with professionals in your target field

What next: 
- Create a portfolio showcasing your technical projects
- Practice system design and troubleshooting scenarios
- Consider contributing to open-source projects

${context ? `\nRelevant from my experience:\n${context}` : ''}`;

    return this.applyPersona(baseResponse, persona);
  }

  private static generateAcademicResponse(_userMessage: string, persona: string, context: string): string {
    const baseResponse = `Drawing from my academic journey and current PhD applications, here's what I've learned:

Why this matters: Academic success requires balancing theoretical knowledge with practical application. My research in 5G energy optimization taught me the importance of choosing problems that matter.

How to approach it:
1. Research Focus: Choose problems that intersect multiple domains (like AI + networking)
2. Publication Strategy: Aim for quality over quantity - my IEEE papers opened many doors
3. University Selection: Target programs that align with your research interests and career goals

What next:
- Develop a clear research proposal with practical applications
- Build relationships with potential supervisors
- Create a portfolio of your research work

${context ? `\nFrom my research experience:\n${context}` : ''}`;

    return this.applyPersona(baseResponse, persona);
  }

  private static generateFinanceResponse(_userMessage: string, persona: string, context: string): string {
    const baseResponse = `From my experience managing finances as a young professional, here's practical advice:

Why this matters: Financial decisions compound over time. Smart choices now create freedom for future opportunities like education or career changes.

How to approach it:
1. Tax Optimization: Structure your salary efficiently (HRA, PF, allowances)
2. Investment Strategy: Start with SIPs in diversified mutual funds
3. Emergency Planning: Maintain 6-9 months of expenses as emergency fund

What next:
- Set up automated savings and investments
- Choose credit cards that align with your spending patterns
- Track expenses using tools like Google Sheets

${context ? `\nFinancial insights:\n${context}` : ''}`;

    return this.applyPersona(baseResponse, persona);
  }

  private static generateTechnicalResponse(_userMessage: string, persona: string, context: string): string {
    const baseResponse = `Based on my work implementing AI-driven automation at ANZ, here's my technical perspective:

Why this matters: Modern systems require intelligent automation and proactive monitoring. The integration of AI with traditional operations is becoming essential.

How to approach it:
1. Observability First: Implement comprehensive monitoring before optimization
2. Automation Strategy: Use AI to enhance human decision-making, not replace it
3. Scalable Architecture: Design systems that can evolve with business needs

What next:
- Start with monitoring and alerting fundamentals
- Experiment with LLM integration in your workflows
- Build expertise in both infrastructure and AI tools

${context ? `\nTechnical experience:\n${context}` : ''}`;

    return this.applyPersona(baseResponse, persona);
  }

  private static generateLifeResponse(_userMessage: string, persona: string, context: string): string {
    const baseResponse = `Life is about finding the right balance between ambition and contentment. Here's what I've learned:

Why this matters: Personal growth and professional success are interconnected. The choices we make shape not just our careers but our overall life satisfaction.

How to approach it:
1. Values Alignment: Ensure your actions align with your core values
2. Continuous Learning: Stay curious and open to new experiences
3. Relationship Building: Invest in meaningful connections

What next:
- Reflect on what truly matters to you
- Set goals that balance personal and professional growth
- Find mentors and communities that support your journey

${context ? `\nPersonal insights:\n${context}` : ''}`;

    return this.applyPersona(baseResponse, persona);
  }

  private static generateGeneralResponse(userMessage: string, persona: string): string {
    const baseResponse = `Hey there! 👋 Thanks for asking about "${userMessage}". 

🔧 I'm currently in beta testing mode! Think of me as Debarun's AI buddy who's still getting his coffee and warming up the brain circuits. ☕🤖

While I'm getting my full AI powers activated, I can still help you explore these areas where I have tons of knowledge:

🚀 Career & Tech: SRE, DevOps, transitioning from academia to industry
🎓 Academic Journey: PhD applications, research strategies, university selection  
💰 Financial Planning: Tax optimization, investment strategies, salary structuring
⚙️ Technical Skills: AI/ML, automation, enterprise architecture
🌟 Life Guidance: Decision-making, work-life balance, personal growth

Coming Soon: Full AI-powered conversations! I'm just waiting for my creator to flip the "smart mode" switch. Until then, I'm like a friendly librarian who knows exactly where all the good stuff is stored! 📚✨

Pro tip: Try exploring different topics - my knowledge search is already working great, and you might find exactly what you're looking for!

What would you like to dive into? I promise the wait for full AI mode will be worth it! 😊`;

    return this.applyPersona(baseResponse, persona);
  }

  private static applyPersona(response: string, persona: string): string {
    const personaModifiers = {
      empathetic: (text: string) => `I understand this can be challenging, and I'm here to support you through it.\n\n${text}\n\nRemember, every expert was once a beginner. You're on the right path by seeking guidance!`,
      direct: (text: string) => `Let me give you the straightforward advice:\n\n${text}\n\nBottom line: Take action on these steps and you'll see progress.`,
      analytical: (text: string) => `Let me break this down systematically:\n\n${text}\n\nThis approach is based on proven methodologies and real-world data.`,
      creative: (text: string) => `Here's an innovative approach to consider:\n\n${text}\n\nThink outside the box - sometimes unconventional paths lead to the best outcomes!`
    };

    const modifier = personaModifiers[persona as keyof typeof personaModifiers];
    return modifier ? modifier(response) : response;
  }
}
