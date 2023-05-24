/*const fs = require('fs');
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
});*/
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
  let position = 'none';
  let positionPrice = 0;

  for (let i = prices.length - 1; i >= 0; i--) {
    if (prices[i] > psar[i]) {
      trend = 'up';
      psarPrice = psar[i];
      if (i > 0 && prices[i - 1] < psar[i - 1]) {
        if (position === 'short') {
          console.log(`Exit Short: ${prices[i]}, PSAR Price: ${psarPrice}`);
          position = 'none';
          positionPrice = 0;
        }
        if (entry === 'none') {
          entry = 'buy';
          trendPrice = prices[i];
          console.log(`Buy Entry: ${trendPrice}, PSAR Price: ${psarPrice}`);
        }
      }
    } else if (prices[i] < psar[i]) {
      trend = 'down';
      psarPrice = psar[i];
      if (i > 0 && prices[i - 1] > psar[i - 1]) {
        if (position === 'long') {
          console.log(`Exit Long: ${prices[i]}, PSAR Price: ${psarPrice}`);
          position = 'none';
          positionPrice = 0;
        }
        if (entry === 'none') {
          entry = 'sell';
          trendPrice = prices[i];
          console.log(`Sell Entry: ${trendPrice}, PSAR Price: ${psarPrice}`);
        }
      }
    }
    if (position === 'none' && entry === 'buy' && prices[i] > trendPrice) {
      position = 'long';
      positionPrice = prices[i];
      console.log(`Long Position: ${positionPrice}`);
      entry = 'none';
    } else if (position === 'none' && entry === 'sell' && prices[i] < trendPrice) {
      position = 'short';
      positionPrice = prices[i];
      console.log(`Short Position: ${positionPrice}`);
      entry = 'none';
    }
  }

  for (let i = prices.length - 2; i >= 0; i--) {
    if (trend === 'up' && prices[i] < psar[i]) {
      trend = 'down';
      trendPrice = prices[i];
      console.log(`Trend changed to ${trend}, Trend Price: ${trendPrice}`);
      if (position === 'long') {
        console.log(`Exit Long: ${prices[i]}, PSAR Price: ${psar[i]}`);
        position = 'none';
        positionPrice = 0;
      }
      break;
    } else if (trend === 'down' && prices[i] > psar[i]) {
      trend = 'up';
      trendPrice = prices[i];
      console.log(`Trend changed to ${trend}, Trend Price: ${trendPrice}`);
      if (position === 'short') {
        console.log(`Exit Short: ${prices[i]}, PSAR Price: ${psar[i]}`);
        position = 'none';
        positionPrice = 0;
      }
      break;
    }
  }

  for (let i = prices.length - 1; i >= 0; i--) {
    if (trend === 'down' && prices[i] > psar[i]) {
      trend = 'up';
      trendPrice = prices[i];
      console.log(`Trend changed to ${trend}, Trend Price: ${trendPrice}`);
      if (position === 'short') {
        console.log(`Exit Short: ${prices[i]}, PSAR Price: ${psar[i]}`);
        position = 'none';
        positionPrice = 0;
      }
      break;
    } else if (trend === 'up' && prices[i] < psar[i]) {
      trend = 'down';
      trendPrice = prices[i];
      console.log(`Trend changed to ${trend}, Trend Price: ${trendPrice}`);
      if (position === 'long') {
        console.log(`Exit Long: ${prices[i]}, PSAR Price: ${psar[i]}`);
        position = 'none';
        positionPrice = 0;
      }
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
