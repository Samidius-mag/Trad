const fs = require('fs');

const SUPPORT_LEVELS = [0.9, 0.8, 0.7];
const RESISTANCE_LEVELS = [1.1, 1.2, 1.3];

function calculateLevels(prices) {
  const currentPrice = prices[prices.length - 1];
  const supportLevels = SUPPORT_LEVELS.map(level => level * currentPrice);
  const resistanceLevels = RESISTANCE_LEVELS.map(level => level * currentPrice);

  return {
    currentPrice,
    supportLevels,
    resistanceLevels
  };
}

function calculateTrend(prices) {
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2];

  if (currentPrice > previousPrice) {
    return 'Восходящий';
  } else if (currentPrice < previousPrice) {
    return 'Нисходящий';
  } else {
    return 'Боковой';
  }
}

function calculateActivity(prices) {
  const currentPrice = prices[prices.length - 1];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const activity = ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100;

  return activity.toFixed(2);
}

fs.readFile('price.json', (err, data) => {
  if (err) throw err;

  const prices = JSON.parse(data).map(candle => parseFloat(candle.close));

  const levels = calculateLevels(prices);
  const trend = calculateTrend(prices);
  const activity = calculateActivity(prices);

  console.log('Текущая цена:', levels.currentPrice);
  console.log('Уровни поддержки:', levels.supportLevels);
  console.log('Уровни сопротивления:', levels.resistanceLevels);
  console.log('Направление тренда:', trend);
  console.log('Активность на рынке:', activity, '%');
});
