const https = require('https');
const fs = require('fs');

const interval = 20000; // 20 seconds
const limit = 5000;
const symbol = 'BTCUSDT';

function loadPrice() {
  https.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=${limit}`, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      const candles = JSON.parse(data);
      const prices = candles.map(candle => parseFloat(candle[4]));
      fs.writeFileSync('price.json', JSON.stringify(prices));
    });
  }).on('error', (err) => {
    console.error(err);
  });
}

loadPrice();
setInterval(loadPrice, interval);
