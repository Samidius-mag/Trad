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

  for (let i = prices.length - 1; i >= 0; i--) {
    if (prices[i] > psar[i]) {
      trend = 'восходящий';
      psarPrice = psar[i];
      if (i > 0 && prices[i - 1] < psar[i - 1]) {
        entry = 'покупку';
        trendPrice = prices[i];
        console.log(`Точка входа в покупку: ${trendPrice}, если цена достигнет: ${psarPrice}`);
        break;
      }
    } else if (prices[i] < psar[i]) {
      trend = 'нисходящий';
      psarPrice = psar[i];
      if (i > 0 && prices[i - 1] > psar[i - 1]) {
        entry = 'продажу';
        trendPrice = prices[i];
        console.log(`Точка входа в: ${trendPrice}, если цена достигнет: ${psarPrice}`);
        break;
      }
    }
  }

  for (let i = prices.length - 2; i >= 0; i--) {
    if (trend === 'восходящий' && prices[i] < psar[i]) {
      trend = 'нисходящий';
      trendPrice = prices[i];
      console.log(`Тренд сменит направление на ${trend}, при цене: ${trendPrice}`);
      break;
    } else if (trend === 'нисходящий' && prices[i] > psar[i]) {
      trend = 'восходящий';
      trendPrice = prices[i];
      console.log(`Тренд сменит направление на ${trend}, при цене: ${trendPrice}`);
      break;
    }
  }

  for (let i = prices.length - 1; i >= 0; i--) {
    if (trend === 'нисходящий' && prices[i] > psar[i]) {
      trend = 'восходящий';
      trendPrice = prices[i];
      console.log(`Тренд сменит направление на ${trend}, при цене: ${trendPrice}`);
      break;
    } else if (trend === 'восходящий' && prices[i] < psar[i]) {
      trend = 'нисходящий';
      trendPrice = prices[i];
      console.log(`Тренд сменит направление на ${trend}, при цене: ${trendPrice}`);
      break;
    }
  }
});
