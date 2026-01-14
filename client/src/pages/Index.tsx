import { Activity } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PredictionCard } from '@/components/PredictionCard';
import { HistoricalChart } from '@/components/HistoricalChart';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Market Predictor</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  ML-powered market analysis
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <PredictionCard />
            <HistoricalChart />
          </div>

          {/* Right Column - Sidebar */}
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Market Sentiment */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Market Sentiment</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bullish</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground">68%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bearish</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: '32%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground">32%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Predictions Today</span>
                  <span className="text-sm font-semibold text-foreground">247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Accuracy Rate</span>
                  <span className="text-sm font-semibold text-green-500">84.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Model Confidence</span>
                  <span className="text-sm font-semibold text-foreground">High</span>
                </div>
              </div>
            </div>

            {/* Top Movers */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Top Movers</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground font-medium">AAPL</span>
                  <span className="text-sm font-semibold text-green-500">+3.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground font-medium">TSLA</span>
                  <span className="text-sm font-semibold text-green-500">+2.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground font-medium">MSFT</span>
                  <span className="text-sm font-semibold text-red-500">-1.2%</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 Market Predictor.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
