from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.generate import router as generate_router

app = FastAPI(
    title="AI Exam Paper Generator",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ROUTES
app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(generate_router, prefix="/generate", tags=["Generate"])



# ROOT
@app.get("/")
def root():
    return {"message": "API is running"}