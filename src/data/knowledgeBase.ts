import { KnowledgeItem } from '../types';
import { comprehensiveKnowledgeBase } from './comprehensiveKnowledge';

// Personal knowledge extracted from your personal files
export const personalKnowledge: KnowledgeItem[] = [
  {
    id: 'profile-identity',
    title: 'Professional Identity',
    content: `Debarun Ghosh is a dynamic and multidimensional technologist, currently serving as a Site Reliability Engineer (SRE) at ANZ, Bengaluru. He blends cloud-native infrastructure knowledge, DevOps automation, and AI-driven innovation to build scalable systems and intelligent agents that streamline enterprise operations.

He is not only an infrastructure optimizer but also a strong AI integrator — designing agentic systems that marry Splunk alerting, Jira workflows, and GitHub automation through custom LLM pipelines (Ollama, Gemini, Mistral, LLaMA) and retrieval-augmented generation (RAG).`,
    tags: ['SRE', 'AI', 'DevOps', 'ANZ', 'automation'],
    category: 'personal',
    type: 'personal'
  },
  {
    id: 'sre-ai-work',
    title: 'SRE & AI DevOps R&D at ANZ',
    content: `Created Agentic MCP AI to automate Splunk queries, map alerts to Jira epics, and generate incident stories using local and cloud-hosted LLMs. Integrated ADK Web, LangChain, Vertex AI, and sentence-transformers for enterprise-grade alert intelligence. Built CI/CD and observability pipelines with GitOps, FastAPI backends, APScheduler, React frontends (Vite + Tailwind), and Dockerized deployments.`,
    tags: ['Splunk', 'Jira', 'LLM', 'CI/CD', 'FastAPI', 'React'],
    category: 'technical',
    type: 'experience'
  },
  {
    id: 'construction-analytics',
    title: 'Construction & Civil Engineering Analytics',
    content: `Deeply involved in Power BI dashboards and SharePoint-based Excel automations for clients like Chalet Hotels. Specializes in S-Curve dashboards, Plan vs Actual comparisons, and multi-year financial variance models with DAX measures and M-code logic. Uses BEXEL Manager for BIM-based Quantity Takeoff (QTO) and Smart Scheduling.`,
    tags: ['Power BI', 'Excel', 'Construction', 'BIM', 'Analytics'],
    category: 'technical',
    type: 'experience'
  },
  {
    id: 'academic-background',
    title: 'Academic Background & Research',
    content: `Bachelor of Technology in Electronics & Communication from REVA University. Published 2 IEEE papers: "AI-driven Energy Optimization in 5G Networks" and "IoT-based Smart Agriculture with Raspberry Pi". Currently applying for PhD programs in Responsible AI, Human-AI Interaction, and Robotics at University of Adelaide, RMIT, and University of South Australia.`,
    tags: ['PhD', 'Research', 'IEEE', '5G', 'IoT', 'AI'],
    category: 'academic',
    type: 'personal'
  }
];

// Research knowledge from your papers
export const researchKnowledge: KnowledgeItem[] = [
  {
    id: '5g-energy-optimization',
    title: '5G Energy Optimization Research',
    content: `AI/ML orchestrates existing RAN power-saving features to cut energy in 5G/HetNets without sacrificing coverage or QoS. Key contributions include feature catalog of sleep modes, carrier/channel shutdowns, micro/macro cell coordination, DRX/paging tuning, and cross-slot scheduling. Uses GA/PSO and other ML tools to select optimal subsets of active BSs/carriers under traffic and QoS constraints.`,
    tags: ['5G', 'Energy', 'AI', 'RAN', 'Optimization', 'GA', 'PSO'],
    category: 'research',
    type: 'research'
  },
  {
    id: 'hybrid-optimization-model',
    title: 'GA+PSO Hybrid Optimization Framework',
    content: `Defines a combined objective O(E,T)=αE + (1-α)T using GA for channel/interference and PSO for traffic-adaptive refinements. Clear division of labor between GA (search) and PSO (adaptation) with tunable energy-traffic tradeoff via α parameter. Includes illustrative simulations of energy/traffic distributions and channel shutdown decisions.`,
    tags: ['GA', 'PSO', 'Optimization', 'Energy', 'Traffic', 'Hybrid'],
    category: 'research',
    type: 'research'
  }
];

// Finance knowledge from your finance infobase
export const financeKnowledge: KnowledgeItem[] = [
  {
    id: 'personal-finance-strategy',
    title: 'Personal Finance & Salary Structuring',
    content: `Managing personal finances requires awareness of income flows and proactive optimization. Salary structuring plays a crucial role: allocating components into tax-efficient categories (basic pay, HRA, allowances, reimbursements, PF) can significantly reduce taxable income. Tax regimes — old vs. new — demand careful yearly evaluation: the old regime rewards investments with deductions, while the new regime offers lower rates but fewer exemptions.`,
    tags: ['Finance', 'Tax', 'Salary', 'PF', 'HRA', 'Investment'],
    category: 'finance',
    type: 'advice'
  },
  {
    id: 'investment-strategy',
    title: 'Investment & Risk Management',
    content: `Structured investments secure future growth. Real estate continues to be both consumption and investment decision. For liquid investments, mutual funds (via SIPs) remain proven: diversified across equity, debt, and hybrid categories. Balanced portfolio includes index funds, debt instruments (PPF, bonds), and alternatives like REITs or gold ETFs. Principle is diversification across time horizons.`,
    tags: ['Investment', 'SIP', 'Mutual Funds', 'Real Estate', 'Portfolio'],
    category: 'finance',
    type: 'advice'
  },
  {
    id: 'financial-tools-tracking',
    title: 'Financial Tools & Tracking',
    content: `Google Sheets dashboards remain versatile for tracking monthly salary inflows, expense outflows, and savings progress. Credit card strategy using specific cards for categories (HDFC IndiGo for travel, ICICI Sapphiro for premium benefits, Amex for rewards) allows optimized reward accumulation. Key is disciplined usage: automate bill payments, avoid revolving credit.`,
    tags: ['Google Sheets', 'Credit Cards', 'Tracking', 'Rewards', 'HDFC', 'ICICI'],
    category: 'finance',
    type: 'advice'
  }
];

// Combined knowledge base with all comprehensive knowledge
export const knowledgeBase: KnowledgeItem[] = [
  ...personalKnowledge,
  ...researchKnowledge,
  ...financeKnowledge,
  ...comprehensiveKnowledgeBase
];
