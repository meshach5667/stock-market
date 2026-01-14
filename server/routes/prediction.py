"""
Prediction routes
"""
from fastapi import APIRouter, HTTPException
from server.schemas import PredictionOutput, HistoricalDataResponse, ModelInfo
from server.services import get_prediction_service

router = APIRouter(prefix="/api", tags=["prediction"])


@router.get("/predict", response_model=PredictionOutput)
async def get_prediction():
    """
    Get market prediction for the next trading day
    """
    try:
        service = get_prediction_service()
        prediction, probability, message = service.predict()
        
        return PredictionOutput(
            prediction=prediction,
            probability=probability,
            message=message
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@router.get("/historical", response_model=HistoricalDataResponse)
async def get_historical_data(limit: int = 100):
    """
    Get historical market data
    """
    try:
        service = get_prediction_service()
        data = service.get_historical_data(limit=limit)
        
        return HistoricalDataResponse(
            data=data,
            total_records=len(data)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")


@router.get("/model-info", response_model=ModelInfo)
async def get_model_info():
    """
    Get information about the prediction model
    """
    try:
        service = get_prediction_service()
        info = service.get_model_info()
        
        return ModelInfo(**info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting model info: {str(e)}")


@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "service": "market-prediction-api"}
