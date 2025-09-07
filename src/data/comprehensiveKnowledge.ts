import { KnowledgeItem } from '../types';

// AI Knowledge Items extracted from your AI folder
export const aiKnowledge: KnowledgeItem[] = [
  {
    id: 'ai-enterprise-integration',
    title: 'AI Enterprise Integration Strategies',
    content: `Enterprise AI integration requires careful consideration of existing workflows, security protocols, and scalability requirements. Key approaches include:

**Agentic AI Systems**: Building AI agents that can autonomously handle routine tasks like alert analysis, incident response, and workflow automation.

**LLM Pipeline Integration**: Implementing local models (Ollama) alongside cloud services (Vertex AI, OpenAI) for optimal cost-performance balance.

**RAG Implementation**: Using retrieval-augmented generation to ensure AI responses are grounded in organizational knowledge and context.

**Monitoring and Observability**: Integrating AI decision-making into existing monitoring frameworks to ensure transparency and accountability.`,
    tags: ['AI', 'Enterprise', 'LLM', 'RAG', 'Automation', 'Integration'],
    category: 'technical',
    type: 'technical'
  },
  {
    id: 'ai-toolchain-development',
    title: 'Modern AI Development Toolchain',
    content: `Building effective AI applications requires a well-structured development environment:

**Model Selection**: Choose between local deployment (Ollama, LM Studio) for privacy and control vs cloud APIs (OpenAI, Anthropic) for cutting-edge capabilities.

**Framework Integration**: Leverage LangChain for complex agent workflows, sentence-transformers for embeddings, and FastAPI for scalable backend services.

**Vector Databases**: Implement efficient similarity search using FAISS for local deployment or Pinecone/Weaviate for cloud solutions.

**Development Workflow**: Use Docker for consistent environments, GitHub Actions for CI/CD, and comprehensive testing frameworks for AI reliability.`,
    tags: ['AI Development', 'Toolchain', 'LangChain', 'Vector Database', 'Docker', 'CI/CD'],
    category: 'technical',
    type: 'technical'
  }
];

// Space and Technology Knowledge
export const spaceKnowledge: KnowledgeItem[] = [
  {
    id: 'space-ai-applications',
    title: 'AI Applications in Space Technology',
    content: `Space technology increasingly relies on AI for mission-critical operations:

**Autonomous Navigation**: AI systems enable spacecraft to make real-time decisions during missions where communication delays make Earth-based control impractical.

**Satellite Data Processing**: Machine learning algorithms process vast amounts of Earth observation data for climate monitoring, agriculture, and disaster response.

**Mission Planning**: AI optimizes trajectory planning, resource allocation, and mission scheduling for complex space missions.

**Robotics Integration**: AI-powered robots assist with satellite servicing, space station maintenance, and planetary exploration.

**Future Opportunities**: The convergence of AI and space technology opens new possibilities in asteroid mining, Mars colonization, and deep space exploration.`,
    tags: ['Space Technology', 'AI', 'Satellite', 'Robotics', 'Navigation', 'Mission Planning'],
    category: 'research',
    type: 'research'
  }
];

// Travel and Life Experience Knowledge
export const travelKnowledge: KnowledgeItem[] = [
  {
    id: 'international-education-planning',
    title: 'International Education and Travel Strategy',
    content: `Planning for international education requires comprehensive preparation:

**Visa and Documentation**: Understanding requirements for student visas, financial documentation, and health clearances for different countries.

**Cultural Adaptation**: Preparing for cultural differences, communication styles, and academic expectations in international environments.

**Financial Planning**: Budgeting for tuition, living expenses, travel costs, and emergency funds with currency fluctuation considerations.

**Networking Strategies**: Building connections with alumni, current students, and professionals in target countries before arrival.

**Academic Preparation**: Understanding different education systems, grading methods, and research expectations across universities.`,
    tags: ['International Education', 'Travel', 'Cultural Adaptation', 'Financial Planning', 'Networking'],
    category: 'personal',
    type: 'advice'
  }
];

// Resume and Career Knowledge
export const careerKnowledge: KnowledgeItem[] = [
  {
    id: 'ats-resume-optimization',
    title: 'ATS-Optimized Resume for SDE/SRE Roles',
    content: `Creating ATS-friendly resumes for technical roles requires strategic formatting and keyword optimization:

**Technical Skills Section**: List programming languages, frameworks, tools, and technologies with proficiency levels and years of experience.

**Quantified Achievements**: Use metrics to demonstrate impact (e.g., "Reduced deployment time by 40%", "Improved system uptime to 99.9%").

**Keyword Integration**: Include relevant technical terms, methodologies, and industry buzzwords that align with job descriptions.

**Project Descriptions**: Focus on technologies used, problems solved, and measurable outcomes rather than just listing responsibilities.

**Format Considerations**: Use simple formatting, standard section headers, and avoid graphics or complex layouts that confuse ATS systems.`,
    tags: ['Resume', 'ATS', 'SRE', 'SDE', 'Career', 'Technical Skills'],
    category: 'professional',
    type: 'advice'
  },
  {
    id: 'career-transition-strategy',
    title: 'Career Transition from Academia to Industry',
    content: `Successfully transitioning from academic research to industry roles requires strategic planning:

**Skill Translation**: Articulate how research skills (data analysis, problem-solving, project management) apply to industry contexts.

**Industry Knowledge**: Research target companies, understand their technology stacks, and familiarize yourself with industry-specific challenges.

**Practical Experience**: Build portfolio projects that demonstrate ability to work with production systems and real-world constraints.

**Networking Approach**: Attend industry conferences, join professional associations, and connect with professionals in target roles.

**Interview Preparation**: Practice explaining complex technical concepts to non-technical audiences and demonstrating practical problem-solving abilities.`,
    tags: ['Career Transition', 'Academia to Industry', 'Skill Translation', 'Networking', 'Interview Prep'],
    category: 'professional',
    type: 'advice'
  }
];

// Research Paper Knowledge
export const advancedResearchKnowledge: KnowledgeItem[] = [
  {
    id: 'research-methodology-guide',
    title: 'Effective Research Methodology and Paper Writing',
    content: `Developing strong research requires systematic methodology and clear communication:

**Problem Definition**: Start with clearly defined research questions that address real-world problems and contribute to existing knowledge.

**Literature Review**: Conduct comprehensive surveys of existing work to identify gaps and position your contribution appropriately.

**Experimental Design**: Design experiments that isolate variables, control for confounding factors, and provide statistically significant results.

**Implementation Strategy**: Use reproducible methodologies, document code and data, and follow open science practices.

**Writing and Publication**: Structure papers with clear abstracts, logical flow, and compelling visualizations that effectively communicate your findings.`,
    tags: ['Research Methodology', 'Academic Writing', 'Experimental Design', 'Literature Review', 'Publication'],
    category: 'academic',
    type: 'advice'
  },
  {
    id: 'phd-application-strategy',
    title: 'PhD Application Strategy and University Selection',
    content: `Successful PhD applications require strategic planning and targeted preparation:

**Research Fit**: Identify faculty whose research interests align with your goals and demonstrate knowledge of their recent work.

**Statement of Purpose**: Write compelling narratives that connect your background, current interests, and future goals with specific program strengths.

**Research Proposal**: Develop feasible research ideas that build on existing work while proposing novel contributions.

**Academic Portfolio**: Build a strong foundation with publications, conference presentations, and research experience.

**University Research**: Understand program structures, funding opportunities, and career outcomes for graduates in your field.`,
    tags: ['PhD Application', 'University Selection', 'Research Proposal', 'Statement of Purpose', 'Academic Career'],
    category: 'academic',
    type: 'advice'
  }
];

// Enhanced Finance Knowledge
export const enhancedFinanceKnowledge: KnowledgeItem[] = [
  {
    id: 'tax-optimization-strategies',
    title: 'Advanced Tax Optimization for Young Professionals',
    content: `Strategic tax planning can significantly increase take-home income and long-term wealth:

**Salary Structure Optimization**: Allocate income across basic pay (40-50%), HRA (40-50%), and allowances to minimize taxable income.

**Investment-Based Deductions**: Utilize ELSS mutual funds, PPF, NPS, and life insurance for 80C deductions while building wealth.

**Regime Comparison**: Annually evaluate old vs new tax regime based on investment capacity and deduction eligibility.

**Reimbursement Strategy**: Maximize tax-free reimbursements for fuel, mobile, internet, and professional development.

**Long-term Planning**: Consider impact of tax decisions on retirement planning, international taxation, and wealth transfer.`,
    tags: ['Tax Planning', 'Salary Structure', 'Investment Deductions', 'Reimbursements', 'Financial Strategy'],
    category: 'finance',
    type: 'advice'
  },
  {
    id: 'investment-portfolio-strategy',
    title: 'Systematic Investment and Portfolio Management',
    content: `Building wealth requires disciplined investment strategy and portfolio diversification:

**Asset Allocation**: Balance equity (60-70%), debt (20-30%), and alternatives (5-10%) based on age and risk tolerance.

**SIP Strategy**: Implement systematic investment plans with auto-debit to ensure consistent wealth building regardless of market conditions.

**Emergency Fund**: Maintain 6-12 months of expenses in liquid investments before committing to long-term wealth building.

**Goal-Based Investing**: Create separate buckets for short-term (1-3 years), medium-term (3-7 years), and long-term (7+ years) objectives.

**Performance Monitoring**: Review portfolio quarterly, rebalance annually, and adjust strategy based on life changes and market conditions.`,
    tags: ['Investment Strategy', 'Portfolio Management', 'SIP', 'Asset Allocation', 'Goal Planning'],
    category: 'finance',
    type: 'advice'
  }
];

// Combined comprehensive knowledge base
export const comprehensiveKnowledgeBase: KnowledgeItem[] = [
  ...aiKnowledge,
  ...spaceKnowledge,
  ...travelKnowledge,
  ...careerKnowledge,
  ...advancedResearchKnowledge,
  ...enhancedFinanceKnowledge
];

// Export all knowledge categories
export const allKnowledgeCategories = {
  ai: aiKnowledge,
  space: spaceKnowledge,
  travel: travelKnowledge,
  career: careerKnowledge,
  research: advancedResearchKnowledge,
  finance: enhancedFinanceKnowledge
};
