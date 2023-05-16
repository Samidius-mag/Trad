const fs = require('fs');

const supportLevels = [0.9, 0.8, 0.7];
const resistanceLevels = [1.1, 1.2, 1.3];

function calculateTrend(prices) {
  const currentPrice = prices[prices.length - 1];
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const trend = currentPrice > averagePrice ? 'up' : 'down';
  return trend;
}

function calculateLevels(prices) {
  const currentPrice = prices[prices.length - 1];
  const support = supportLevels.map(level => currentPrice * level);
  const resistance = resistanceLevels.map(level => currentPrice * level);
  return { support, resistance };
}

function analyzePrice() {
  const prices = JSON.parse(fs.readFileSync('price.json'));
  const trend = calculateTrend(prices);
  const levels = calculateLevels(prices);
  console.log(`Тренд: ${trend}`);
  console.log(`Уровни поддержки: ${levels.support}`);
  console.log(`Уровни сопротивления: ${levels.resistance}`);
}

analyzePrice();
