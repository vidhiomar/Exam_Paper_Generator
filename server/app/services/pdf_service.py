import pdfplumber
import re
import logging
from typing import List

logger = logging.getLogger(__name__)

NOISE_PATTERNS = [
    r'Page \d+',
    r'Confidential',
    r'Report'
]

COMPILED_PATTERNS = [
    re.compile(p, re.IGNORECASE) for p in NOISE_PATTERNS
]

class PDFService:

    @staticmethod
    def extract_text(file_path: str)-> str:
        
        """Extracts text from a PDF file."""
        texts:List[str] = []

        try:
            with pdfplumber.open(file_path) as pdf:
                total_pages = len(pdf.pages)
                logger.info(f"Opened PDF with {total_pages} pages")

                for page in pdf.pages:
                    page_text = page.extract_text()

                    if page_text:
                        texts.append(page_text)

            logger.info(f"Extracted text from {len(texts)} pages")
        
        except Exception as e:
            logger.exception(f"Error extracting text from PDF: {e}")
            return ""
        
        if not texts:
            logger.warning("No text extracted from PDF")
        
        full_text = "\n".join(texts)
        return PDFService.clean_text(full_text)
    
    @staticmethod
    def clean_text(text: str) -> str:     

        """Clean extracted text for better parsing"""

        lines = text.split("\n")
        cleaned_lines: List[str]=[]

        for line in lines:
            line = line.strip()

            if not line:
                continue

            if any(pattern.search(line) for pattern in COMPILED_PATTERNS):
                continue

            line = re.sub(r'\s+', ' ', line)

            line = (line.replace(" ?", "?").replace(" .", ".")
                    .replace(" ,", ",").replace(" :", ":"))
            
            line = re.sub(r'^(\d+)\s*\)', r'\1)', line)
            
            cleaned_lines.append(line)
        return "\n".join(cleaned_lines)
    