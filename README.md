# Trading Bot Core

A framework for building automated trading bots.

## Features

- Exchange API wrappers (CEX and DEX)
- Strategy backtesting
- Risk management
- Position tracking

## Structure

```
src/
  exchanges/   Exchange API clients
  strategies/  Trading strategies
  risk/        Risk management
  bot.js       Main bot logic
```

## Usage

```bash
npm install
node src/bot.js --strategy momentum --exchange binance
```

## Warning

This is for educational purposes. Trading involves risk. Never run automated trading without thorough testing.

## License

MIT
