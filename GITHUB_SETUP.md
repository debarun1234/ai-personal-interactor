# GitHub Setup and Deployment Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click "New repository" (+ icon)
3. Repository name: `ai-personal-interactor`
4. Description: "AI Personal Mentoring System - Interactive chat interface powered by knowledge base"
5. Make it **Public** (required for free GitHub Pages)
6. **Don't** initialize with README, .gitignore, or license
7. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-personal-interactor.git
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. The deployment workflow is already configured!

## Step 4: Verify Deployment

- Your site will be available at: `https://YOUR_USERNAME.github.io/ai-personal-interactor/`
- Check the "Actions" tab for deployment status
- First deployment may take 2-3 minutes

## Step 5: Set Up AI (Optional)

To enable real AI responses instead of mock responses:

1. Get API keys from:
   - OpenAI: https://platform.openai.com/api-keys
   - OR Anthropic: https://console.anthropic.com/

2. Add to GitHub repository secrets:
   - Go to Settings > Secrets and variables > Actions
   - Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
   - This will enable AI in the deployed version

## What's Included

✅ **Frontend**: React + TypeScript + Tailwind CSS
✅ **Backend**: FastAPI + Semantic Search
✅ **Knowledge Base**: 236 items from your Data folder
✅ **Deployment**: Automated GitHub Actions
✅ **AI Integration**: Ready for OpenAI/Anthropic APIs

## Live Features

- Interactive chat interface
- Multiple mentoring personas
- Knowledge-based responses
- Mobile-responsive design
- Real-time search through your expertise

## Repository Structure

```
ai-personal-interactor/
├── src/                 # React frontend
├── backend/             # FastAPI backend  
├── Data/                # Your knowledge base
├── .github/workflows/   # Auto-deployment
└── dist/                # Built files
```

Your AI mentoring system will be live and accessible to anyone once deployed! 🚀
