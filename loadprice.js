const axios = require('axios');
const fs = require('fs');

const url = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=5000';

axios.get(url)
  .then(response => {
    const prices = response.data.map(candle => parseFloat(candle[4]));
    fs.writeFile('price.json', JSON.stringify(prices), (err) => {
      if (err) throw err;
      console.log('записано');
    });
  })
  .catch(error => {
    console.log(error);
  });
