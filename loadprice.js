const https = require('https');
const fs = require('fs');

const url = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=5000';

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const candles = JSON.parse(data);
    const prices = candles.map(candle => parseFloat(candle[4]));
    fs.writeFile('price.json', JSON.stringify(prices), (err) => {
      if (err) throw err;
      console.log('Записано');
    });
  });

}).on('error', (err) => {
  console.log('Ошибка: ' + err.message);
});
