const BASE_URL = 'http://localhost:8000/api';

export interface PredictionResult {
  prediction: 0 | 1;
  probability: number;
}

export interface MarketData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HistoricalResponse {
  data: MarketData[];
}

export interface ModelInfo {
  model_type: string;
  description: string;
  predictors: string[];
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithError<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(`Request failed: ${response.statusText}`, response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error. Please check your connection.');
  }
}

export async function getPrediction(): Promise<PredictionResult> {
  return fetchWithError<PredictionResult>(`${BASE_URL}/predict`);
}

export async function getHistoricalData(days = 30): Promise<MarketData[]> {
  const response = await fetchWithError<HistoricalResponse>(
    `${BASE_URL}/historical?days=${days}`
  );
  return response.data;
}

export async function getModelInfo(): Promise<ModelInfo> {
  return fetchWithError<ModelInfo>(`${BASE_URL}/model-info`);
}

// Mock data for development when backend is not available
export const mockPrediction: PredictionResult = {
  prediction: 1,
  probability: 0.83,
};

export const mockHistoricalData: MarketData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const basePrice = 4000 + Math.random() * 200 - 100;
  return {
    date: date.toISOString().split('T')[0],
    open: basePrice,
    high: basePrice + Math.random() * 50,
    low: basePrice - Math.random() * 50,
    close: basePrice + (Math.random() - 0.5) * 60,
    volume: 3000000000 + Math.random() * 1000000000,
  };
});

export const mockModelInfo: ModelInfo = {
  model_type: 'RandomForestClassifier',
  description: 'Random Forest classifier trained on rolling technical indicators',
  predictors: [
    'Close_Ratio_3',
    'Trend_5',
    'RSI_14',
    'MA_20',
    'Volume_Ratio',
    'Volatility_10',
    'Momentum_7',
    'MACD_Signal',
  ],
};
