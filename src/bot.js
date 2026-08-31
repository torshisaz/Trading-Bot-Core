#!/usr/bin/env node

import BinanceClient from './exchanges/binance.js';
import MomentumStrategy from './strategies/momentum.js';
import RiskManager from './risk/manager.js';

const args = process.argv.slice(2);
const apiKey = process.env.BINANCE_API_KEY || '';
const apiSecret = process.env.BINANCE_API_SECRET || '';
const symbol = args.find(a => a.startsWith('--symbol='))?.split('=')[1] || 'BTCUSDT';
const interval = parseInt(args.find(a => a.startsWith('--interval='))?.split('=')[1]) || 60000;

async function main() {
  if (!apiKey || !apiSecret) {
    console.log('Running in simulation mode (no API keys)');
  }

  const exchange = apiKey ? new BinanceClient(apiKey, apiSecret) : null;
  const strategy = new MomentumStrategy({ lookback: 14, threshold: 0.02 });
  const risk = new RiskManager({ maxPositionSize: 0.1, stopLossPct: 0.02 });

  console.log('Trading Bot Core');
  console.log('Symbol:', symbol);
  console.log('Interval:', interval, 'ms');
  console.log('');

  let position = null;
  let lastPrice = 0;

  async function tick() {
    // Simulate price if no API
    const price = exchange
      ? (await exchange.getTicker(symbol)).lastPrice
      : lastPrice * (1 + (Math.random() - 0.5) * 0.01);

    lastPrice = parseFloat(price);
    strategy.addPrice(lastPrice);

    const signal = strategy.getSignal();

    if (signal === 'BUY' && !position && risk.canOpenPosition(1000)) {
      console.log(`[${new Date().toISOString()}] BUY signal @ ${lastPrice}`);
      position = { entryPrice: lastPrice, side: 'LONG', value: 1000 };
      risk.addPosition(position);
    } else if (signal === 'SELL' && position) {
      const pnl = (lastPrice - position.entryPrice) / position.entryPrice * position.value;
      console.log(`[${new Date().toISOString()}] SELL signal @ ${lastPrice} | PnL: ${pnl.toFixed(2)}`);
      risk.removePosition(position);
      position = null;
    }

    if (position && risk.shouldStopLoss(position.entryPrice, lastPrice, position.side)) {
      console.log(`[${new Date().toISOString()}] STOP LOSS @ ${lastPrice}`);
      risk.removePosition(position);
      position = null;
    }

    if (risk.checkDailyLoss()) {
      console.log('Daily loss limit reached. Stopping.');
      process.exit(0);
    }
  }

  setInterval(tick, interval);
  tick();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
