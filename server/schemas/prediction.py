"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class PredictionInput(BaseModel):
    """Input schema for market prediction"""
    close: float
    volume: float
    open: float
    high: float
    low: float
    # Historical data for rolling calculations
    historical_closes: List[float]
    historical_targets: List[int]


class PredictionOutput(BaseModel):
    """Output schema for market prediction"""
    prediction: int  # 0 = market will go down, 1 = market will go up
    probability: float
    message: str


class MarketData(BaseModel):
    """Schema for market data"""
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: float


class HistoricalDataResponse(BaseModel):
    """Response schema for historical data"""
    data: List[MarketData]
    total_records: int


class ModelInfo(BaseModel):
    """Schema for model information"""
    model_type: str
    predictors: List[str]
    description: str
