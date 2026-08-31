// Risk management

export class RiskManager {
  constructor(config = {}) {
    this.maxPositionSize = config.maxPositionSize || 0.1; // 10% of portfolio
    this.maxDailyLoss = config.maxDailyLoss || 0.05; // 5%
    this.stopLossPct = config.stopLossPct || 0.02; // 2%
    this.startBalance = config.startBalance || 10000;
    this.currentBalance = this.startBalance;
    this.dailyStart = this.startBalance;
    this.positions = [];
  }

  canOpenPosition(size) {
    const positionValue = this.positions.reduce((sum, p) => sum + p.value, 0);
    const maxAllowed = this.currentBalance * this.maxPositionSize;
    return positionValue + size <= maxAllowed;
  }

  shouldStopLoss(entryPrice, currentPrice, side) {
    if (side === 'LONG') {
      return currentPrice <= entryPrice * (1 - this.stopLossPct);
    } else {
      return currentPrice >= entryPrice * (1 + this.stopLossPct);
    }
  }

  checkDailyLoss() {
    const dailyLoss = (this.dailyStart - this.currentBalance) / this.dailyStart;
    return dailyLoss >= this.maxDailyLoss;
  }

  addPosition(position) {
    this.positions.push(position);
  }

  removePosition(position) {
    const index = this.positions.indexOf(position);
    if (index >= 0) this.positions.splice(index, 1);
  }

  updateBalance(newBalance) {
    this.currentBalance = newBalance;
  }

  resetDaily() {
    this.dailyStart = this.currentBalance;
  }
}

export default RiskManager;
