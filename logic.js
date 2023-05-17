const fs = require('fs');
const { ROC } = require('technicalindicators');

fs.readFile('price.json', (err, data) => {
  if (err) throw err;

  const prices = JSON.parse(data);

  const roc = ROC.calculate({ period: 14, values: prices });

  const rvi = roc.reduce((sum, value) => {
    return sum + value;
  }, 0) / roc.length;

  let trend = '';
  if (rvi > 0.5) {
    trend = 'восходящий';
  } else if (rvi < -0.5) {
    trend = 'нисходящий';
  } else {
    trend = 'боковой';
  }

  const support = Math.min(...prices);
  const resistance = Math.max(...prices);

  const monthlyTrend = prices[0] < prices[prices.length - 1] ? 'восходящий' : 'нисходящий';
  const dailyTrend = prices[prices.length - 2] < prices[prices.length - 1] ? 'восходящий' : 'нисходящий';
  const currentTrend = prices[prices.length - 1] > prices[prices.length - 2] ? 'восходящий' : 'нисходящий';

  const currentPrice = prices[prices.length - 1];

  const volatility = roc.reduce((sum, value) => {
    return sum + Math.abs(value);
  }, 0) / roc.length;

  console.log(`Тренд: ${trend}`);
  console.log(`Уровень поддержки: ${support}`);
  console.log(`Уровень сопротивления: ${resistance}`);
  console.log(`Месячный тренд: ${monthlyTrend}`);
  console.log(`Дневной тренд: ${dailyTrend}`);
  console.log(`Текущий тренд: ${currentTrend}`);
  console.log(`Текущая цена: ${currentPrice}`);
  console.log(`Скорость движения рынка: ${rvi}`);
  console.log(`Волатильность: ${volatility}`);
});
