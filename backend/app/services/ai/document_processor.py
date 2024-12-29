from typing import Dict, Any, List
from app.services.ai.ollama_client import OllamaClient
from app.core.config import settings
import aiofiles
import magic
import textract

class DocumentProcessor:
    def __init__(self):
        self.ollama = OllamaClient()
    
    async def process_document(
        self,
        file_path: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process a document and extract information"""
        try:
            # Detect file type
            mime = magic.Magic(mime=True)
            file_type = mime.from_file(file_path)
            
            # Extract text
            text = await self._extract_text(file_path, file_type)
            
            # Analyze text
            analysis = await self._analyze_text(text, metadata)
            
            return {
                'file_type': file_type,
                'analysis': analysis,
                'metadata': metadata
            }
        except Exception as e:
            raise Exception(f"Error processing document: {str(e)}")
    
    async def _extract_text(self, file_path: str, file_type: str) -> str:
        """Extract text from document"""
        try:
            text = textract.process(file_path).decode('utf-8')
            return text
        except Exception as e:
            raise Exception(f"Error extracting text: {str(e)}")
    
    async def _analyze_text(self, text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze text content"""
        try:
            # Get document classification
            classification = await self.ollama.analyze_text(
                text=text,
                analysis_type='legal_classification'
            )
            
            # Extract key information
            key_info = await self.ollama.analyze_text(
                text=text,
                analysis_type='key_information'
            )
            
            # Detect citations
            citations = await self.ollama.analyze_text(
                text=text,
                analysis_type='citations'
            )
            
            # Generate summary
            summary = await self.ollama.analyze_text(
                text=text,
                analysis_type='summary'
            )
            
            return {
                'classification': classification,
                'key_information': key_info,
                'citations': citations,
                'summary': summary
            }
        except Exception as e:
            raise Exception(f"Error analyzing text: {str(e)}")
