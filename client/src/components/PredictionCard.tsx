import { RefreshCw, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPrediction, mockPrediction, type PredictionResult } from '@/lib/api';

const USE_MOCK = false; // Set to true for mock data when backend is not running

export function PredictionCard() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500));
        setPrediction(mockPrediction);
      } else {
        const data = await getPrediction();
        setPrediction(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prediction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  const isBullish = prediction?.prediction === 1;
  const confidence = prediction ? Math.round(prediction.probability * 100) : 0;

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Market Prediction</h2>
        <button
          onClick={fetchPrediction}
          disabled={loading}
          className="btn-icon"
          aria-label="Refresh prediction"
        >
          <RefreshCw
            className={`h-4 w-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button onClick={fetchPrediction} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="h-12 w-12 rounded-full border-4 border-border border-t-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Analyzing market...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Prediction Signal */}
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                isBullish ? 'bg-success/10' : 'bg-destructive/10'
              }`}
              style={{
                backgroundColor: isBullish
                  ? 'hsl(160 84% 39% / 0.1)'
                  : 'hsl(0 84% 60% / 0.1)',
              }}
            >
              {isBullish ? (
                <TrendingUp
                  className="h-8 w-8"
                  style={{ color: 'hsl(160 84% 39%)' }}
                />
              ) : (
                <TrendingDown
                  className="h-8 w-8"
                  style={{ color: 'hsl(0 84% 60%)' }}
                />
              )}
            </div>
            <div>
              <p className="stat-value" style={{ color: isBullish ? 'hsl(160 84% 39%)' : 'hsl(0 84% 60%)' }}>
                {isBullish ? 'Bullish' : 'Bearish'}
              </p>
              <p className="stat-label">Next Day Outlook</p>
            </div>
          </div>

          {/* Confidence Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Model Confidence
              </span>
              <span className="text-sm font-semibold text-foreground">{confidence}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${confidence}%`,
                  backgroundColor: isBullish ? 'hsl(160 84% 39%)' : 'hsl(0 84% 60%)',
                }}
              />
            </div>
          </div>

          {/* Timestamp */}
          <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
