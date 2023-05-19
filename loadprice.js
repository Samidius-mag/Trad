const axios = require('axios');
const fs = require('fs');

const url = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=8760';
const url2 = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=5m&limit=12';
axios.get(url)
  .then(response => {
    const data = response.data.map(candle => ({
      time: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
      closeTime: candle[6],
      quoteAssetVolume: parseFloat(candle[7]),
      numberOfTrades: candle[8],
      takerBuyBaseAssetVolume: parseFloat(candle[9]),
      takerBuyQuoteAssetVolume: parseFloat(candle[10])
    }));
    fs.writeFileSync('price.json', JSON.stringify(data));
    console.log('Data saved to price.json');
  })
  .catch(error => {
    console.log(error);
  });

// Добавляем паузу на 5 секунд
setTimeout(() => {
  axios.get(url2)
  .then(response => {
    const data = response.data.map(candle => ({
      time: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
      closeTime: candle[6],
      quoteAssetVolume: parseFloat(candle[7]),
      numberOfTrades: candle[8],
      takerBuyBaseAssetVolume: parseFloat(candle[9]),
      takerBuyQuoteAssetVolume: parseFloat(candle[10])
    }));
    fs.writeFileSync('price5m.json', JSON.stringify(data));
    console.log('Data saved to price5m.json');
  })
  .catch(error => {
    console.log(error);
  });
  }, 5000);
