import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from datetime import datetime
# NOTE: Removed 'FileResponse', 'pyttsx3', 'run_in_threadpool' imports

# -----------------
# 1. APP SETUP
# -----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------
# 2. ENDPOINTS
# -----------------
@app.get("/")
def read_root():
    """Simple root path to confirm the server is running."""
    return {"message": "SimpleAI API is running!"}

@app.post("/chat")
async def chat_endpoint(message: dict):
    """
    The main chat endpoint. It receives user text and returns a reply.
    (This function will be updated in Phase 2 to call the Gemini LLM.)
    """

    user_text = message.get("text", "")

    # Placeholder Logic
    if "time" in user_text.lower():
        reply = f"The current time is {datetime.now().strftime('%H:%M:%S')}. (from FastAPI)"
    else:
        # This is the message that will be replaced by the Gemini response in Phase 2
        reply = f"FastAPI received: '{user_text}'. Now ready for LLM integration."

    return {"response": reply}


# -----------------
# 3. RUNNER
# -----------------
