const fs = require('fs');
const { PSAR } = require('technicalindicators');

fs.readFile('price.json', (err, data) => {
  if (err) throw err;

  const prices = JSON.parse(data).map(candle => parseFloat(candle.close));
  const psar = PSAR.calculate({ high: prices, low: prices, step: 0.05, max: 0.2 });

  let trend = 'none';
  let entry = 'none';
  let psarPrice = 0;
  let trendPrice = 0;

  if (prices[prices.length - 1] > psar[psar.length - 1]) {
    trend = 'up';
    psarPrice = psar[psar.length - 1];
    if (prices[prices.length - 2] < psar[psar.length - 2]) {
      entry = 'buy';
      trendPrice = prices[prices.length - 1];
    }
  } else if (prices[prices.length - 1] < psar[psar.length - 1]) {
    trend = 'down';
    psarPrice = psar[psar.length - 1];
    if (prices[prices.length - 2] > psar[psar.length - 2]) {
      entry = 'sell';
      trendPrice = prices[prices.length - 1];
    }
  }

  console.log(`Trend: ${trend}, Entry: ${entry}, PSAR Price: ${psarPrice}, Trend Price: ${trendPrice}`);

  for (let i = prices.length - 2; i >= 0; i--) {
    if (trend === 'up' && prices[i] < psar[i]) {
      trend = 'down';
      trendPrice = prices[i];
      console.log(`Trend changed to ${trend}, Trend Price: ${trendPrice}`);
    } else if (trend === 'down' && prices[i] > psar[i]) {
      trend = 'up';
      trendPrice = prices[i];
      console.log(`Trend changed to ${trend}, Trend Price: ${trendPrice}`);
    }
  }
});
