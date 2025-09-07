# 🤖 RoamMentor AI Backend Setup

This backend provides real AI-powered mentoring using your comprehensive knowledge base.

## Quick Start

### 1. **Setup Backend Environment**

```bash
# Navigate to backend directory
cd backend

# Run setup script
# Windows:
setup.bat

# Unix/Linux/macOS:
chmod +x setup.sh
./setup.sh
```

### 2. **Configure API Keys**

Edit the `.env` file with your API keys:

```env
# Choose one AI provider
OPENAI_API_KEY=sk-your-openai-key-here
# OR
ANTHROPIC_API_KEY=your-anthropic-key-here

# Other settings (optional)
DEFAULT_AI_PROVIDER=openai
OPENAI_MODEL=gpt-4-turbo-preview
DEFAULT_TEMPERATURE=0.7
```

### 3. **Start the Backend**

```bash
# Activate virtual environment (if not already active)
# Windows:
venv\Scripts\activate
# Unix/Linux/macOS:
source venv/bin/activate

# Start the server
python main.py
```

The backend will be available at: `http://localhost:8000`

### 4. **Start Frontend with Backend**

```bash
# In the main project directory
npm run dev
```

The frontend will automatically detect and use the backend when available.

## 🔍 What the Backend Does

### **Knowledge Processing**
- **Reads all your markdown files** from the `Data` folder
- **Extracts and structures content** into searchable knowledge items
- **Creates semantic embeddings** using sentence-transformers
- **Builds FAISS index** for fast similarity search

### **AI Integration**
- **OpenAI GPT-4** or **Anthropic Claude** integration
- **Context-aware responses** using your knowledge base
- **Streaming responses** for real-time chat experience
- **Relevance scoring** to find most relevant knowledge

### **API Endpoints**
- `POST /api/chat` - Generate AI responses
- `POST /api/chat/stream` - Stream AI responses
- `POST /api/knowledge/search` - Search knowledge base
- `GET /api/knowledge/categories` - Get knowledge categories
- `GET /health` - Backend health check

## 📊 Backend Features

### **Intelligent Search**
- Semantic similarity search through your entire knowledge base
- Category-based filtering (personal, technical, research, finance, etc.)
- Relevance scoring and ranking

### **Context Integration**
- Automatically finds relevant knowledge for each query
- Includes source citations in responses
- Maintains conversation context across messages

### **Performance Optimization**
- FAISS vector database for sub-second search
- Cached embeddings for fast startup
- Efficient batch processing of documents

## 🛠️ Technical Stack

- **FastAPI** - Modern Python web framework
- **Sentence Transformers** - Semantic embeddings
- **FAISS** - Vector similarity search
- **OpenAI/Anthropic** - Large language models
- **Uvicorn** - ASGI server

## 📁 Knowledge Base Structure

Your `Data` folder is automatically processed into categories:

```
Data/
├── AI Knowledge/ → ai_technical
├── General Knowledge/
│   ├── finance_*.md → finance
│   ├── space_*.md → space_research
│   ├── travel_*.md → travel_life
│   └── ats_resume_*.md → career
├── Personal/ → personal
└── Research paper/ → research
```

## 🔧 Configuration Options

### **AI Provider Settings**
```env
DEFAULT_AI_PROVIDER=openai  # openai, anthropic
OPENAI_MODEL=gpt-4-turbo-preview
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

### **Response Settings**
```env
DEFAULT_TEMPERATURE=0.7     # Creativity level (0-1)
DEFAULT_MAX_TOKENS=1000     # Response length
MAX_CONTEXT_ITEMS=5         # Knowledge items per response
```

### **Server Settings**
```env
HOST=0.0.0.0               # Server host
PORT=8000                  # Server port
RELOAD=true                # Auto-reload on changes
```

## 🐛 Troubleshooting

### **Backend Won't Start**
1. Check Python version: `python --version` (3.8+ required)
2. Verify virtual environment is activated
3. Check requirements installation: `pip list`

### **Knowledge Base Not Loading**
1. Verify `Data` folder path in `main.py`
2. Check markdown file encoding (should be UTF-8)
3. Look for errors in console output

### **AI Responses Not Working**
1. Verify API keys in `.env` file
2. Check API key permissions and quota
3. Monitor console for API errors

### **Frontend Can't Connect**
1. Ensure backend is running on port 8000
2. Check CORS settings in `main.py`
3. Verify no firewall blocking localhost:8000

## 📈 Performance Tips

1. **First Run**: Initial processing takes 2-3 minutes for large knowledge bases
2. **Subsequent Runs**: Knowledge base is cached for fast startup
3. **Memory Usage**: Approximately 1GB RAM for full knowledge base
4. **Search Speed**: Sub-second response times with FAISS indexing

## 🔄 Updating Knowledge Base

To refresh the knowledge base after adding new content:

```bash
# Option 1: Restart the backend (automatic refresh)
python main.py

# Option 2: Use API endpoint (while running)
curl -X POST http://localhost:8000/api/knowledge/rebuild
```

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**: Set production API keys
2. **Server Configuration**: Use production ASGI server
3. **Security**: Add authentication and rate limiting
4. **Monitoring**: Implement logging and health checks

---

**Ready to start?** Run `setup.bat` (Windows) or `setup.sh` (Unix) and follow the prompts!
