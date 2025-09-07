import os
import asyncio
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
import markdown
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
import pickle
from dataclasses import dataclass, asdict
import re

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class KnowledgeItem:
    id: str
    title: str
    content: str
    source_file: str
    category: str
    tags: List[str]
    embedding: Optional[np.ndarray] = None

class KnowledgeProcessor:
    def __init__(self, data_folder: str, model_name: str = "all-MiniLM-L6-v2"):
        self.data_folder = Path(data_folder)
        self.model = SentenceTransformer(model_name)
        self.knowledge_items: List[KnowledgeItem] = []
        self.index = None
        self.embeddings = None
        
    def extract_content_from_markdown(self, file_path: Path) -> Dict[str, Any]:
        """Extract structured content from markdown files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Convert markdown to plain text for processing
            md = markdown.Markdown(extensions=['pymdownx.superfences', 'pymdownx.tasklist'])
            html_content = md.convert(content)
            
            # Extract title (first h1 or filename)
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            title = title_match.group(1) if title_match else file_path.stem.replace('_', ' ').title()
            
            # Extract sections
            sections = self._split_into_sections(content)
            
            # Determine category based on folder structure
            category = self._determine_category(file_path)
            
            # Extract tags from content
            tags = self._extract_tags(content, file_path)
            
            return {
                'title': title,
                'content': content,
                'sections': sections,
                'category': category,
                'tags': tags,
                'source_file': str(file_path)
            }
            
        except Exception as e:
            logger.error(f"Error processing {file_path}: {e}")
            return None
    
    def _split_into_sections(self, content: str) -> List[Dict[str, str]]:
        """Split markdown content into logical sections"""
        sections = []
        
        # Split by headers
        header_pattern = r'^(#{1,6})\s+(.+)$'
        lines = content.split('\n')
        current_section = {'title': '', 'content': '', 'level': 0}
        
        for line in lines:
            header_match = re.match(header_pattern, line)
            if header_match:
                # Save previous section if it has content
                if current_section['content'].strip():
                    sections.append(current_section.copy())
                
                # Start new section
                level = len(header_match.group(1))
                title = header_match.group(2)
                current_section = {
                    'title': title,
                    'content': '',
                    'level': level
                }
            else:
                current_section['content'] += line + '\n'
        
        # Add last section
        if current_section['content'].strip():
            sections.append(current_section)
        
        return sections
    
    def _determine_category(self, file_path: Path) -> str:
        """Determine category based on folder structure"""
        parts = file_path.parts
        
        if 'AI Knowledge' in parts:
            return 'ai_technical'
        elif 'General Knowledge' in parts:
            if 'finance' in file_path.name.lower():
                return 'finance'
            elif 'space' in file_path.name.lower():
                return 'space_research'
            elif 'travel' in file_path.name.lower():
                return 'travel_life'
            elif 'ats_resume' in file_path.name.lower():
                return 'career'
            else:
                return 'general'
        elif 'Personal' in parts:
            return 'personal'
        elif 'Research paper' in parts:
            return 'research'
        else:
            return 'general'
    
    def _extract_tags(self, content: str, file_path: Path) -> List[str]:
        """Extract relevant tags from content"""
        tags = set()
        
        # Add category-based tags
        filename = file_path.name.lower()
        if 'ai' in filename:
            tags.update(['AI', 'Machine Learning', 'Technology'])
        if 'finance' in filename:
            tags.update(['Finance', 'Investment', 'Money Management'])
        if 'space' in filename:
            tags.update(['Space', 'Astronomy', 'Research'])
        if 'travel' in filename:
            tags.update(['Travel', 'Cultural', 'International'])
        if 'personal' in filename:
            tags.update(['Personal', 'Experience', 'Life'])
        if 'research' in filename:
            tags.update(['Research', 'Academic', 'Papers'])
        
        # Extract technical terms and keywords
        tech_keywords = [
            'SRE', 'DevOps', 'AI', 'ML', 'Python', 'Docker', 'Kubernetes',
            'AWS', 'Azure', 'GCP', 'React', 'FastAPI', 'LangChain',
            'OpenAI', 'Anthropic', 'LLM', 'RAG', 'Vector', 'Database',
            'Monitoring', 'Observability', 'CI/CD', 'GitOps', 'Automation'
        ]
        
        finance_keywords = [
            'Investment', 'SIP', 'Mutual Fund', 'Tax', 'Salary', 'HRA',
            'PF', 'PPF', 'Credit Card', 'Insurance', 'Portfolio', 'Risk'
        ]
        
        academic_keywords = [
            'PhD', 'Research', 'University', 'Paper', 'Publication',
            'Thesis', 'Academia', 'Conference', 'Journal', 'Grant'
        ]
        
        all_keywords = tech_keywords + finance_keywords + academic_keywords
        
        content_lower = content.lower()
        for keyword in all_keywords:
            if keyword.lower() in content_lower:
                tags.add(keyword)
        
        return list(tags)
    
    async def process_all_files(self):
        """Process all markdown files in the data folder"""
        logger.info(f"Processing files in {self.data_folder}")
        
        # Find all markdown files
        md_files = list(self.data_folder.rglob("*.md"))
        logger.info(f"Found {len(md_files)} markdown files")
        
        for file_path in md_files:
            logger.info(f"Processing: {file_path}")
            extracted_data = self.extract_content_from_markdown(file_path)
            
            if extracted_data:
                # Create knowledge items for each section
                sections = extracted_data['sections']
                if not sections:
                    # If no sections, use entire content
                    sections = [{'title': extracted_data['title'], 'content': extracted_data['content'], 'level': 1}]
                
                for i, section in enumerate(sections):
                    if len(section['content'].strip()) < 50:  # Skip very short sections
                        continue
                        
                    item_id = f"{file_path.stem}_{i}"
                    knowledge_item = KnowledgeItem(
                        id=item_id,
                        title=section['title'] or extracted_data['title'],
                        content=section['content'].strip(),
                        source_file=extracted_data['source_file'],
                        category=extracted_data['category'],
                        tags=extracted_data['tags']
                    )
                    self.knowledge_items.append(knowledge_item)
        
        logger.info(f"Created {len(self.knowledge_items)} knowledge items")
    
    def create_embeddings(self):
        """Create embeddings for all knowledge items"""
        logger.info("Creating embeddings...")
        
        texts = []
        for item in self.knowledge_items:
            # Combine title and content for better embeddings
            combined_text = f"{item.title}\n\n{item.content}"
            texts.append(combined_text)
        
        # Generate embeddings
        embeddings = self.model.encode(texts, show_progress_bar=True)
        
        # Store embeddings in knowledge items
        for i, embedding in enumerate(embeddings):
            self.knowledge_items[i].embedding = embedding
        
        self.embeddings = embeddings
        logger.info(f"Created embeddings with shape: {embeddings.shape}")
    
    def create_faiss_index(self):
        """Create FAISS index for similarity search"""
        logger.info("Creating FAISS index...")
        
        if self.embeddings is None:
            raise ValueError("Embeddings not created yet. Call create_embeddings() first.")
        
        # Create FAISS index
        dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dimension)  # Inner Product for cosine similarity
        
        # Normalize embeddings for cosine similarity
        normalized_embeddings = self.embeddings / np.linalg.norm(self.embeddings, axis=1, keepdims=True)
        normalized_embeddings_float32 = normalized_embeddings.astype('float32')
        self.index.add(x=normalized_embeddings_float32)
        
        logger.info(f"FAISS index created with {self.index.ntotal} vectors")
    
    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search for relevant knowledge items"""
        if self.index is None:
            raise ValueError("FAISS index not created yet.")
        
        # Create query embedding
        query_embedding = self.model.encode([query])
        query_embedding = query_embedding / np.linalg.norm(query_embedding, axis=1, keepdims=True)
        
        # Search
        distances = np.empty((query_embedding.shape[0], top_k), dtype=np.float32)
        indices = np.empty((query_embedding.shape[0], top_k), dtype=np.int64)
        distances, indices = self.index.search(query_embedding.astype('float32'), top_k)
        
        results = []
        for i, (score, idx) in enumerate(zip(distances[0], indices[0])):
            if idx < len(self.knowledge_items):
                item = self.knowledge_items[idx]
                results.append({
                    'id': item.id,
                    'title': item.title,
                    'content': item.content,
                    'category': item.category,
                    'tags': item.tags,
                    'source_file': item.source_file,
                    'similarity_score': float(score),
                    'rank': i + 1
                })
        
        return results
    
    def save_knowledge_base(self, output_path: str):
        """Save processed knowledge base to disk"""
        logger.info(f"Saving knowledge base to {output_path}")
        
        # Prepare data for saving
        knowledge_data = []
        for item in self.knowledge_items:
            item_dict = asdict(item)
            if item_dict['embedding'] is not None:
                item_dict['embedding'] = item_dict['embedding'].tolist()
            knowledge_data.append(item_dict)
        
        # Save as JSON
        with open(f"{output_path}.json", 'w', encoding='utf-8') as f:
            json.dump({
                'knowledge_items': knowledge_data,
                'total_items': len(knowledge_data),
                'categories': list(set(item.category for item in self.knowledge_items))
            }, f, indent=2, ensure_ascii=False)
        
        # Save FAISS index
        if self.index is not None:
            faiss.write_index(self.index, f"{output_path}_faiss.index")
        
        # Save embeddings
        if self.embeddings is not None:
            np.save(f"{output_path}_embeddings.npy", self.embeddings)
        
        logger.info("Knowledge base saved successfully")
    
    def load_knowledge_base(self, input_path: str):
        """Load processed knowledge base from disk"""
        logger.info(f"Loading knowledge base from {input_path}")
        
        # Load JSON data
        with open(f"{input_path}.json", 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Reconstruct knowledge items
        self.knowledge_items = []
        for item_dict in data['knowledge_items']:
            if item_dict['embedding'] is not None:
                item_dict['embedding'] = np.array(item_dict['embedding'])
            
            knowledge_item = KnowledgeItem(**item_dict)
            self.knowledge_items.append(knowledge_item)
        
        # Load FAISS index
        index_path = f"{input_path}_faiss.index"
        if os.path.exists(index_path):
            self.index = faiss.read_index(index_path)
        
        # Load embeddings
        embeddings_path = f"{input_path}_embeddings.npy"
        if os.path.exists(embeddings_path):
            self.embeddings = np.load(embeddings_path)
        
        logger.info(f"Loaded {len(self.knowledge_items)} knowledge items")

async def main():
    """Main function to process knowledge base"""
    data_folder = "../Data"  # Path to your Data folder
    output_path = "knowledge_base"
    
    processor = KnowledgeProcessor(data_folder)
    
    # Process all files
    await processor.process_all_files()
    
    # Create embeddings and index
    processor.create_embeddings()
    processor.create_faiss_index()
    
    # Save knowledge base
    processor.save_knowledge_base(output_path)
    
    # Test search
    test_queries = [
        "How to optimize salary for tax savings?",
        "What is SRE and DevOps?",
        "PhD application strategy",
        "AI in 5G networks",
        "Investment planning for young professionals"
    ]
    
    print("\n" + "="*50)
    print("TESTING KNOWLEDGE SEARCH")
    print("="*50)
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        results = processor.search(query, top_k=3)
        for result in results:
            print(f"  [{result['rank']}] {result['title']} (Score: {result['similarity_score']:.3f})")
            print(f"      Category: {result['category']} | Tags: {', '.join(result['tags'][:3])}")
            print(f"      Preview: {result['content'][:100]}...")
            print()

if __name__ == "__main__":
    asyncio.run(main())
