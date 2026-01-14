"""
Market prediction service - handles model loading and predictions
"""
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from typing import List, Tuple
import yfinance as yf
import os

# Get the directory where this file is located
BASE_DIR = Path(os.path.dirname(os.path.abspath(__file__))).parent
MODEL_PATH = BASE_DIR / "model" / "market_model.joblib"
PREDICTORS_PATH = BASE_DIR / "model" / "predictors.joblib"
DATA_PATH = BASE_DIR.parent / "sp500.csv"


class PredictionService:
    """Service for market predictions"""
    
    def __init__(self):
        self.model = None
        self.predictors = None
        self._load_model()
    
    def _load_model(self):
        """Load the trained model and predictors"""
        if MODEL_PATH.exists() and PREDICTORS_PATH.exists():
            self.model = joblib.load(MODEL_PATH)
            self.predictors = joblib.load(PREDICTORS_PATH)
        else:
            raise FileNotFoundError(
                f"Model files not found. Please train the model first. "
                f"Expected: {MODEL_PATH} and {PREDICTORS_PATH}"
            )
    
    def _calculate_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Calculate rolling features for prediction"""
        horizons = [2, 5, 60, 250, 1000]
        
        for horizon in horizons:
            rolling_averages = df["Close"].rolling(horizon).mean()
            
            ratio_column = f"Close_Ratio_{horizon}"
            df[ratio_column] = df["Close"] / rolling_averages
            
            trend_column = f"Trend_{horizon}"
            df[trend_column] = df["Target"].shift(1).rolling(horizon).sum()
        
        return df
    
    def get_latest_data(self, days: int = 1100) -> pd.DataFrame:
        """Get latest S&P 500 data for prediction"""
        # Load historical data
        if DATA_PATH.exists():
            df = pd.read_csv(DATA_PATH, index_col=0, parse_dates=True)
        else:
            # Fetch from yfinance
            ticker = yf.Ticker("^GSPC")
            df = ticker.history(period="max")
        
        # Clean data
        if "Dividends" in df.columns:
            df = df.drop(columns=["Dividends"])
        if "Stock Splits" in df.columns:
            df = df.drop(columns=["Stock Splits"])
        
        # Add target column
        df["Tomorrow"] = df["Close"].shift(-1)
        df["Target"] = (df["Tomorrow"] > df["Close"]).astype(int)
        
        # Get last N days (need enough for rolling calculations)
        return df.tail(days)
    
    def predict(self) -> Tuple[int, float, str]:
        """
        Make a prediction for the next day's market movement
        Returns: (prediction, probability, message)
        """
        # Get data with enough history for rolling features
        df = self.get_latest_data()
        
        # Calculate features
        df = self._calculate_features(df)
        
        # Drop NaN rows
        df = df.dropna()
        
        # Get the latest row for prediction
        latest = df.iloc[-1:]
        
        # Make prediction
        features = latest[self.predictors]
        prediction = int(self.model.predict(features)[0])
        probability = float(self.model.predict_proba(features)[0][prediction])
        
        if prediction == 1:
            message = f"Model predicts the market will go UP tomorrow with {probability:.1%} confidence"
        else:
            message = f"Model predicts the market will go DOWN tomorrow with {probability:.1%} confidence"
        
        return prediction, probability, message
    
    def get_historical_data(self, limit: int = 100) -> List[dict]:
        """Get historical market data"""
        df = self.get_latest_data(days=limit + 50)  # Extra for safety
        df = df.tail(limit)
        
        records = []
        for date_idx, row in df.iterrows():
            records.append({
                "date": str(date_idx.date()) if hasattr(date_idx, 'date') else str(date_idx)[:10],
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"])
            })
        
        return records
    
    def get_model_info(self) -> dict:
        """Get information about the loaded model"""
        return {
            "model_type": type(self.model).__name__,
            "predictors": self.predictors,
            "description": "Random Forest Classifier trained on S&P 500 historical data with rolling features"
        }


# Singleton instance
_prediction_service = None


def get_prediction_service() -> PredictionService:
    """Get or create the prediction service singleton"""
    global _prediction_service
    if _prediction_service is None:
        _prediction_service = PredictionService()
    return _prediction_service
