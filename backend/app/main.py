import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import scan

DEFAULT_ORIGINS = "http://localhost:5173,http://localhost:3000"
allowedOrigins = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")]

app = FastAPI(title="Web Threat Detection API", version="0.1.0")
app.include_router(scan.router)

# Origins come from the environment so hosting needs no code change
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowedOrigins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Lets teammates check quickly that the server is running
@app.get("/health")
def health_check():
    return {"status": "ok"}