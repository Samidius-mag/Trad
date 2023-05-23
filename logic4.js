const fs = require('fs');
const { PSAR } = require('technicalindicators');

fs.readFile('price.json', (err, data) => {
  if (err) throw err;

  const prices = JSON.parse(data).map(candle => parseFloat(candle.close));
  const psar = PSAR.calculate({ high: prices, low: prices, step: 0.02, max: 0.2 });

  let trend = 'none';
  let entry = 'none';
  let psarPrice = 0;
  let trendPrice = 0;
  let reversalPrice = 0;

  for (let i = prices.length - 1; i >= 0; i--) {
    if (prices[i] > psar[i]) {
      trend = 'up';
      psarPrice = psar[i];
      if (i > 0 && prices[i - 1] < psar[i - 1]) {
        entry = 'buy';
        trendPrice = prices[i];
        console.log(`Buy Entry: ${trendPrice}, PSAR Price: ${psarPrice}`);
        break;
      }
    } else if (prices[i] < psar[i]) {
      trend = 'down';
      psarPrice = psar[i];
      if (i > 0 && prices[i - 1] > psar[i - 1]) {
        entry = 'sell';
        trendPrice = prices[i];
        console.log(`Sell Entry: ${trendPrice}, PSAR Price: ${psarPrice}`);
        break;
      }
    }
  }

  for (let i = prices.length - 2; i >= 0; i--) {
    if (trend === 'up' && prices[i] < psar[i]) {
      trend = 'down';
      trendPrice = prices[i];
      console.log(`Trend changed to ${trend}, Trend Price: ${trendPrice}`);
      break;
    } else if (trend === 'down' && prices[i] > psar[i]) {
      trend = 'up';
      trendPrice = prices[i];
      console.log(`Trend changed to ${trend}, Trend Price: ${trendPrice}`);
      break;
    }
  }

  for (let i = prices.length - 1; i >= 0; i--) {
    if (trend === 'down' && prices[i] > psar[i]) {
      trend = 'up';
      trendPrice = prices[i];
      console.log(`Trend changed to ${trend}, Trend Price: ${trendPrice}`);
      break;
    } else if (trend === 'up' && prices[i] < psar[i]) {
      trend = 'down';
      trendPrice = prices[i];
      console.log(`Trend changed to ${trend}, Trend Price: ${trendPrice}`);
      break;
    }
  }

  if (trend === 'up') {
    for (let i = prices.length - 1; i >= 0; i--) {
      if (prices[i] < psar[i]) {
        reversalPrice = prices[i];
        console.log(`Reversal Price: ${reversalPrice}`);
        break;
      }
    }
  } else if (trend === 'down') {
    for (let i = prices.length - 1; i >= 0; i--) {
      if (prices[i] > psar[i]) {
        reversalPrice = prices[i];
        console.log(`Reversal Price: ${reversalPrice}`);
        break;
      }
    }
  }
});
