import os
from fastapi import APIRouter, UploadFile, File
from app.services.pdf_service import PDFService

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract text
    text = PDFService.extract_text(file_path)

    return {
        "filename": file.filename,
        "preview": text[:1000]
    }
