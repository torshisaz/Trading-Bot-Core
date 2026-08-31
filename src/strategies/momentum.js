// Simple momentum strategy

export class MomentumStrategy {
  constructor(config = {}) {
    this.lookback = config.lookback || 14;
    this.threshold = config.threshold || 0.02;
    this.prices = [];
  }

  addPrice(price) {
    this.prices.push(price);
    if (this.prices.length > this.lookback * 2) {
      this.prices.shift();
    }
  }

  getSignal() {
    if (this.prices.length < this.lookback) return 'HOLD';

    const recent = this.prices.slice(-this.lookback);
    const older = this.prices.slice(0, this.lookback);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    const change = (recentAvg - olderAvg) / olderAvg;

    if (change > this.threshold) return 'BUY';
    if (change < -this.threshold) return 'SELL';
    return 'HOLD';
  }

  reset() {
    this.prices = [];
  }
}

export default MomentumStrategy;
