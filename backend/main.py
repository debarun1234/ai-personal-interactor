import os
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import logging
from datetime import datetime
import asyncio

from knowledge_processor import KnowledgeProcessor
from ai_service import AIService, AIProvider, ChatMessage

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="RoamMentor AI Backend",
    description="AI-powered personal mentor backend service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:5175", 
        "http://localhost:4173", 
        "https://*.github.io",
        "https://debarun1234.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
knowledge_processor: Optional[KnowledgeProcessor] = None
ai_service: Optional[AIService] = None

# Request/Response models
class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    mode: str = "life"
    persona: str = "empathetic"
    enabled_knowledge_packs: List[str] = ["personal"]
    temperature: float = 0.7
    max_tokens: int = 1000
    stream: bool = False

class ChatResponse(BaseModel):
    response: str
    sources: List[Dict[str, Any]] = []
    processing_time: float
    tokens_used: Optional[int] = None

class KnowledgeSearchRequest(BaseModel):
    query: str
    top_k: int = 5
    categories: List[str] = []

class KnowledgeSearchResponse(BaseModel):
    results: List[Dict[str, Any]]
    total_found: int

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global knowledge_processor, ai_service
    
    logger.info("Starting RoamMentor AI Backend...")
    
    try:
        # Initialize knowledge processor
        knowledge_processor = KnowledgeProcessor("../Data")
        
        # Try to load existing knowledge base
        knowledge_base_path = "knowledge_base"
        if os.path.exists(f"{knowledge_base_path}.json"):
            logger.info("Loading existing knowledge base...")
            knowledge_processor.load_knowledge_base(knowledge_base_path)
        else:
            logger.info("Creating new knowledge base...")
            await knowledge_processor.process_all_files()
            knowledge_processor.create_embeddings()
            knowledge_processor.create_faiss_index()
            knowledge_processor.save_knowledge_base(knowledge_base_path)
        
        # Initialize AI service
        ai_provider = AIProvider.OPENAI  # Default to OpenAI
        if os.getenv("ANTHROPIC_API_KEY"):
            ai_provider = AIProvider.ANTHROPIC
        elif not os.getenv("OPENAI_API_KEY"):
            logger.warning("No AI API keys found. Using mock responses.")
            ai_service = None
        else:
            ai_service = AIService(ai_provider)
        
        logger.info("RoamMentor AI Backend started successfully!")
        
    except Exception as e:
        logger.error(f"Failed to start backend: {e}")
        raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "RoamMentor AI Backend is running!",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "knowledge_items": len(knowledge_processor.knowledge_items) if knowledge_processor else 0,
        "ai_service_available": ai_service is not None
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "knowledge_processor": knowledge_processor is not None,
            "ai_service": ai_service is not None,
            "knowledge_items_count": len(knowledge_processor.knowledge_items) if knowledge_processor else 0
        },
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    start_time = datetime.now()
    
    try:
        if not knowledge_processor:
            raise HTTPException(status_code=500, detail="Knowledge processor not initialized")
        
        # Extract user query from messages
        user_messages = [msg for msg in request.messages if msg["role"] == "user"]
        if not user_messages:
            raise HTTPException(status_code=400, detail="No user message found")
        
        latest_query = user_messages[-1]["content"]
        
        # Search for relevant knowledge
        relevant_knowledge = knowledge_processor.search(latest_query, top_k=5)
        
        # Filter by enabled knowledge packs if specified
        if request.enabled_knowledge_packs:
            relevant_knowledge = [
                item for item in relevant_knowledge 
                if item["category"] in request.enabled_knowledge_packs
            ]
        
        # Generate AI response
        if ai_service:
            # Convert request messages to ChatMessage objects
            chat_messages = [
                ChatMessage(role=msg["role"], content=msg["content"]) 
                for msg in request.messages
            ]
            
            # Create system prompt with context
            system_prompt = ai_service.create_system_prompt(
                request.mode, 
                request.persona, 
                relevant_knowledge
            )
            
            # Generate response
            ai_response = await ai_service.generate_response(
                chat_messages,
                system_prompt,
                request.temperature,
                request.max_tokens
            )
        else:
            # Fallback to mock response
            ai_response = generate_mock_response(
                latest_query, 
                request.mode, 
                request.persona, 
                relevant_knowledge
            )
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return ChatResponse(
            response=ai_response,
            sources=relevant_knowledge[:3],  # Return top 3 sources
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    """Streaming chat endpoint"""
    
    async def generate_stream():
        try:
            if not knowledge_processor:
                yield f"data: {json.dumps({'error': 'Knowledge processor not initialized'})}\n\n"
                return
            
            # Search for relevant knowledge
            user_messages = [msg for msg in request.messages if msg["role"] == "user"]
            if user_messages:
                latest_query = user_messages[-1]["content"]
                relevant_knowledge = knowledge_processor.search(latest_query, top_k=5)
                
                # Filter by enabled knowledge packs
                if request.enabled_knowledge_packs:
                    relevant_knowledge = [
                        item for item in relevant_knowledge 
                        if item["category"] in request.enabled_knowledge_packs
                    ]
            else:
                relevant_knowledge = []
            
            if ai_service:
                # Convert to ChatMessage objects
                chat_messages = [
                    ChatMessage(role=msg["role"], content=msg["content"]) 
                    for msg in request.messages
                ]
                
                # Create system prompt
                system_prompt = ai_service.create_system_prompt(
                    request.mode, 
                    request.persona, 
                    relevant_knowledge
                )
                
                # Stream response
                async for chunk in ai_service.stream_response(
                    chat_messages,
                    system_prompt,
                    request.temperature,
                    request.max_tokens
                ):
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
                    
                # Send sources at the end
                yield f"data: {json.dumps({'sources': relevant_knowledge[:3]})}\n\n"
                yield f"data: {json.dumps({'done': True})}\n\n"
            else:
                # Mock streaming response
                mock_response = generate_mock_response(
                    latest_query if user_messages else "Hello",
                    request.mode,
                    request.persona,
                    relevant_knowledge
                )
                
                # Simulate streaming by sending chunks
                words = mock_response.split()
                for i in range(0, len(words), 3):  # Send 3 words at a time
                    chunk = " ".join(words[i:i+3]) + " "
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
                    await asyncio.sleep(0.1)  # Small delay for realism
                
                yield f"data: {json.dumps({'sources': relevant_knowledge[:3]})}\n\n"
                yield f"data: {json.dumps({'done': True})}\n\n"
                
        except Exception as e:
            logger.error(f"Error in streaming: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
        }
    )

@app.post("/api/knowledge/search", response_model=KnowledgeSearchResponse)
async def search_knowledge(request: KnowledgeSearchRequest):
    """Search knowledge base endpoint"""
    
    try:
        if not knowledge_processor:
            raise HTTPException(status_code=500, detail="Knowledge processor not initialized")
        
        # Search knowledge base
        results = knowledge_processor.search(request.query, request.top_k)
        
        # Filter by categories if specified
        if request.categories:
            results = [
                item for item in results 
                if item["category"] in request.categories
            ]
        
        return KnowledgeSearchResponse(
            results=results,
            total_found=len(results)
        )
        
    except Exception as e:
        logger.error(f"Error in knowledge search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/knowledge/categories")
async def get_knowledge_categories():
    """Get available knowledge categories"""
    
    if not knowledge_processor:
        raise HTTPException(status_code=500, detail="Knowledge processor not initialized")
    
    categories = list(set(item.category for item in knowledge_processor.knowledge_items))
    category_counts = {}
    
    for category in categories:
        count = sum(1 for item in knowledge_processor.knowledge_items if item.category == category)
        category_counts[category] = count
    
    return {
        "categories": categories,
        "category_counts": category_counts,
        "total_items": len(knowledge_processor.knowledge_items)
    }

@app.post("/api/knowledge/rebuild")
async def rebuild_knowledge_base(background_tasks: BackgroundTasks):
    """Rebuild knowledge base from source files"""
    
    async def rebuild_task():
        global knowledge_processor
        try:
            logger.info("Starting knowledge base rebuild...")
            
            # Reinitialize processor
            knowledge_processor = KnowledgeProcessor("../Data")
            await knowledge_processor.process_all_files()
            knowledge_processor.create_embeddings()
            knowledge_processor.create_faiss_index()
            knowledge_processor.save_knowledge_base("knowledge_base")
            
            logger.info("Knowledge base rebuild completed successfully")
            
        except Exception as e:
            logger.error(f"Error rebuilding knowledge base: {e}")
    
    background_tasks.add_task(rebuild_task)
    
    return {
        "message": "Knowledge base rebuild started in background",
        "status": "processing"
    }

def generate_mock_response(query: str, mode: str, persona: str, context: List[Dict[str, Any]]) -> str:
    """Generate friendly mock response when AI service is not available"""
    
    # Handle casual greetings
    casual_greetings = ["hi", "hello", "hey", "how are you", "how are", "what's up", "sup", "good morning", "good afternoon", "good evening"]
    thank_you_patterns = ["thanks", "thank you", "ty", "thx"]
    
    query_lower = query.lower().strip().rstrip('?!.')
    
    if any(greeting in query_lower for greeting in casual_greetings):
        return """Hey there! 👋 I'm doing great, thanks for asking! 

🔧 I'm currently in beta testing mode - think of me as Debarun's AI buddy who's still getting his coffee and warming up the brain circuits! ☕🤖

I'm excited to chat with you about:
🚀 Career & Tech • 🎓 Academic Journey • 💰 Financial Planning • ⚙️ Technical Skills • 🌟 Life Guidance

What's on your mind today? I'd love to help you explore any of these areas! 😊"""
    
    if any(thanks in query_lower for thanks in thank_you_patterns):
        return """You're so welcome! 😊 

That's what I'm here for - helping awesome people like you navigate life's challenges and opportunities!

Feel free to ask me anything else about career moves, academic planning, tech skills, financial strategies, or just life in general. I've got tons of knowledge ready to share! 🌟

What else can we explore together? ☕"""
    
    context_summary = ""
    if context:
        context_summary = f"\n\n💡 I found some relevant info from my knowledge base about {', '.join(set(item['category'] for item in context[:3]))} that might help!"
    
    base_response = f"""Hey there! 👋 Thanks for asking about "{query}". 

🔧 I'm currently in beta testing mode! Think of me as Debarun's AI buddy who's still getting his coffee and warming up the brain circuits. ☕🤖

{context_summary}

While I'm getting my full AI powers activated, I can still help you explore these areas where I have tons of knowledge:

🚀 Career & Tech: SRE, DevOps, transitioning from academia to industry
🎓 Academic Journey: PhD applications, research strategies, university selection  
💰 Financial Planning: Tax optimization, investment strategies, salary structuring
⚙️ Technical Skills: AI/ML, automation, enterprise architecture
🌟 Life Guidance: Decision-making, work-life balance, personal growth

Coming Soon: Full AI-powered conversations! I'm just waiting for my creator to flip the "smart mode" switch. Until then, I'm like a friendly librarian who knows exactly where all the good stuff is stored! 📚✨

Pro tip: Try exploring different topics - my knowledge search is already working great, and you might find exactly what you're looking for!

What would you like to dive into? I promise the wait for full AI mode will be worth it! 😊"""
    
    return base_response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
