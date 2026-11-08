from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Web Threat Detection API", version="0.1.0")

# Allow the React dev servers to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Lets teammates check quickly that the server is running
@app.get("/health")
def health_check():
    return {"status": "ok"}
