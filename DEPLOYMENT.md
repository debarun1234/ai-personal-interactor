# 🚀 Deployment Guide for RoamMentor

## Quick Deployment to GitHub Pages

### 1. **Initialize Git Repository**
```bash
git init
git add .
git commit -m "Initial commit: RoamMentor AI Personal Mentor"
```

### 2. **Create GitHub Repository**
1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it `ai-personal-interactor` (or your preferred name)
3. Make it public for GitHub Pages
4. Don't initialize with README (we already have one)

### 3. **Connect and Push**
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-personal-interactor.git
git branch -M main
git push -u origin main
```

### 4. **Enable GitHub Pages**
1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` (will be created automatically)
4. Click Save

### 5. **Automatic Deployment**
The GitHub Actions workflow will automatically:
- Build the project on every push to `main`
- Deploy to GitHub Pages
- Make it available at: `https://YOUR_USERNAME.github.io/ai-personal-interactor/`

## Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Install gh-pages if not already installed
npm install -g gh-pages

# Deploy to GitHub Pages
npm run deploy
```

## Environment Setup

### Prerequisites
- Node.js 18+
- Git
- GitHub account

### Local Development
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-personal-interactor.git
cd ai-personal-interactor

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Configuration

### Base URL Configuration
The `vite.config.ts` is already configured for GitHub Pages:
```typescript
export default defineConfig({
  base: '/ai-personal-interactor/',
  // ... other config
})
```

### Domain Configuration
To use a custom domain:
1. Create a `CNAME` file in the `public` directory
2. Add your domain name to the file
3. Configure DNS settings with your domain provider

## Features Included

✅ **Responsive Design** - Works on all devices  
✅ **TypeScript** - Type-safe development  
✅ **Tailwind CSS** - Modern styling  
✅ **GitHub Actions** - Automated deployment  
✅ **Knowledge Base** - Comprehensive mentoring content  
✅ **Mock AI Service** - Ready for real AI integration  
✅ **SEO Optimized** - Meta tags and descriptions  

## Next Steps for Real AI Integration

### 1. **Backend Service**
Replace `MockChatService` with actual AI API:
- OpenAI API
- Anthropic Claude
- Local LLM via Ollama
- Custom FastAPI backend

### 2. **Environment Variables**
```typescript
// Add to .env
VITE_OPENAI_API_KEY=your_api_key
VITE_API_BASE_URL=your_backend_url
```

### 3. **Real-time Features**
- WebSocket connections
- Streaming responses
- Conversation persistence

## Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Issues
- Check GitHub Actions logs
- Verify base URL in vite.config.ts
- Ensure gh-pages branch exists

### Development Issues
```bash
# Check for TypeScript errors
npm run lint

# Fix formatting
npm run format
```

## Support

For issues or questions:
1. Check the GitHub Issues page
2. Review the documentation
3. Contact the maintainer

---

**Ready to deploy?** Follow the steps above and your AI mentor will be live! 🎉
