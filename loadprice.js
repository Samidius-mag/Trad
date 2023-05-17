const https = require('https');
const fs = require('fs');

const symbol = 'BTCUSDT';
const interval = '1h';
const limit = 5000;

const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const candles = JSON.parse(data);

    const prices = candles.map((candle) => {
      return parseFloat(candle[4]);
    });

    fs.writeFile('price.json', JSON.stringify(prices), (err) => {
      if (err) throw err;
      console.log('записано');
    });
  });
}).on('error', (err) => {
  console.log('Ошибка: ' + err.message);
});
