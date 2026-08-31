// Binance API client (simplified)

export class BinanceClient {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = 'https://api.binance.com';
  }

  async request(method, path, params = {}) {
    const url = new URL(this.baseUrl + path);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'X-MBX-APIKEY': this.apiKey,
      },
    });

    return response.json();
  }

  async getTicker(symbol) {
    return this.request('GET', '/api/v3/ticker/24hr', { symbol });
  }

  async getBalance() {
    return this.request('GET', '/api/v3/account');
  }

  async placeOrder(symbol, side, quantity, price) {
    const params = {
      symbol,
      side,
      type: 'LIMIT',
      quantity,
      price,
      timeInForce: 'GTC',
      timestamp: Date.now(),
    };

    return this.request('POST', '/api/v3/order', params);
  }

  async cancelOrder(symbol, orderId) {
    return this.request('DELETE', '/api/v3/order', {
      symbol,
      orderId,
      timestamp: Date.now(),
    });
  }

  async getOpenOrders(symbol) {
    return this.request('GET', '/api/v3/openOrders', {
      symbol,
      timestamp: Date.now(),
    });
  }
}

export default BinanceClient;
