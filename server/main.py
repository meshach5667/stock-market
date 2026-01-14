"""
FastAPI Main Application for Market Prediction API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes import prediction_router

app = FastAPI(
    title="S&P 500 Market Prediction API",
    description="API for predicting S&P 500 market movements using machine learning",
    version="1.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",  "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prediction_router)


@app.get("/")
async def root():
    return {
        "message": "S&P 500 Market Prediction API",
    }
