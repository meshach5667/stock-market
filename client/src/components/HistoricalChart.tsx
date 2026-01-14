import { BarChart3, AlertCircle, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getHistoricalData, mockHistoricalData, type MarketData } from '@/lib/api';

const USE_MOCK = false; // Set to true for mock data when backend is not running

export function HistoricalChart() {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        setData(mockHistoricalData);
      } else {
        const result = await getHistoricalData(30);
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch historical data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const latest = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : latest;
    const change = ((latest.close - previous.close) / previous.close) * 100;
    const minClose = Math.min(...data.map((d) => d.close));
    const maxClose = Math.max(...data.map((d) => d.close));
    return { latest, change, minClose, maxClose };
  }, [data]);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

  const formatVolume = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    return num.toLocaleString();
  };

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Historical Data</h2>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="btn-icon"
          aria-label="Refresh historical data"
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
          <button onClick={fetchData} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-6">
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 animate-pulse">
                <div className="h-3 bg-secondary rounded w-16 mb-2" />
                <div className="h-6 bg-secondary rounded w-24" />
              </div>
            ))}
          </div>
          <div className="h-32 bg-secondary rounded animate-pulse" />
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-secondary rounded" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border">
              <div>
                <p className="stat-label">Latest Close</p>
                <p className="text-xl font-bold text-foreground">
                  ${formatNumber(stats.latest.close)}
                </p>
              </div>
              <div>
                <p className="stat-label">Change</p>
                <div className="flex items-center gap-1">
                  {stats.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" style={{ color: 'hsl(160 84% 39%)' }} />
                  ) : (
                    <TrendingDown className="h-4 w-4" style={{ color: 'hsl(0 84% 60%)' }} />
                  )}
                  <p
                    className="text-xl font-bold"
                    style={{
                      color: stats.change >= 0 ? 'hsl(160 84% 39%)' : 'hsl(0 84% 60%)',
                    }}
                  >
                    {stats.change >= 0 ? '+' : ''}
                    {stats.change.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div>
                <p className="stat-label">Range</p>
                <p className="text-sm font-medium text-foreground">
                  ${formatNumber(stats.minClose)} - ${formatNumber(stats.maxClose)}
                </p>
              </div>
            </div>
          )}

          {/* Simple Bar Chart */}
          {stats && (
            <div className="h-32 flex items-end gap-0.5">
              {data.map((item, index) => {
                const range = stats.maxClose - stats.minClose;
                const height = range > 0 
                  ? ((item.close - stats.minClose) / range) * 100 
                  : 50;
                const isPositive =
                  index === 0 || item.close >= data[index - 1].close;

                return (
                  <div
                    key={item.date}
                    className="flex-1 rounded-t transition-all duration-200 hover:opacity-80"
                    style={{
                      height: `${Math.max(height, 5)}%`,
                      backgroundColor: isPositive
                        ? 'hsl(160 84% 39%)'
                        : 'hsl(0 84% 60%)',
                    }}
                    title={`${item.date}: $${formatNumber(item.close)}`}
                  />
                );
              })}
            </div>
          )}

          {/* Data Table - Last 10 entries */}
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 px-2 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="py-2 px-2 text-right font-medium text-muted-foreground">
                    Open
                  </th>
                  <th className="py-2 px-2 text-right font-medium text-muted-foreground">
                    High
                  </th>
                  <th className="py-2 px-2 text-right font-medium text-muted-foreground">
                    Low
                  </th>
                  <th className="py-2 px-2 text-right font-medium text-muted-foreground">
                    Close
                  </th>
                  <th className="py-2 px-2 text-right font-medium text-muted-foreground">
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.slice(-10).reverse().map((item) => (
                  <tr
                    key={item.date}
                    className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-2 px-2 text-foreground font-medium">
                      {item.date}
                    </td>
                    <td className="py-2 px-2 text-right text-muted-foreground">
                      ${formatNumber(item.open)}
                    </td>
                    <td className="py-2 px-2 text-right text-muted-foreground">
                      ${formatNumber(item.high)}
                    </td>
                    <td className="py-2 px-2 text-right text-muted-foreground">
                      ${formatNumber(item.low)}
                    </td>
                    <td className="py-2 px-2 text-right text-foreground font-medium">
                      ${formatNumber(item.close)}
                    </td>
                    <td className="py-2 px-2 text-right text-muted-foreground">
                      {formatVolume(item.volume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
