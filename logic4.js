const fs = require('fs');

const data = JSON.parse(fs.readFileSync('price.json'));

// функция для расчета процентного отклонения
function calculateDeviation(period) {
  const prices = data.slice(-period).map(candle => parseFloat(candle.close));
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const deviation = Math.sqrt(prices.reduce((sum, price) => sum + Math.pow(price - average, 2), 0) / prices.length);
  return deviation / average * 100;
}

// расчет процентного отклонения для периодов 1 час, 4 часа, 12 часов и 24 часов
const deviation1h = calculateDeviation(21*1);
const deviation4h = calculateDeviation(55 * 1);
const deviation12h = calculateDeviation(89 * 1);
const deviation24h = calculateDeviation(144 * 1);

console.log(`1h deviation: ${deviation1h}%`);
console.log(`4h deviation: ${deviation4h}%`);
console.log(`12h deviation: ${deviation12h}%`);
console.log(`24h deviation: ${deviation24h}%`);

// функция для расчета уровней поддержки и сопротивления
function calculateLevels(period, deviation) {
  const prices = data.slice(-period).map(candle => parseFloat(candle.close));
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const support = average - average * deviation / 100;
  const resistance = average + average * deviation / 100;
  return { support, resistance };
}

// расчет уровней поддержки и сопротивления для периодов 1 час, 4 часа, 12 часов и 24 часов
const levels1h = calculateLevels(1, deviation1h);
const levels4h = calculateLevels(4 * 1, deviation4h);
const levels12h = calculateLevels(12 * 1, deviation12h);
const levels24h = calculateLevels(24 * 1, deviation24h);

console.log(`1h levels: support ${levels1h.support}, resistance ${levels1h.resistance}`);
console.log(`4h levels: support ${levels4h.support}, resistance ${levels4h.resistance}`);
console.log(`12h levels: support ${levels12h.support}, resistance ${levels12h.resistance}`);
console.log(`24h levels: support ${levels24h.support}, resistance ${levels24h.resistance}`);
