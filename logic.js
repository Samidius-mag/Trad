const fs = require('fs');
const { ROC } = require('technicalindicators');

const data = fs.readFileSync('price.json');
const prices = JSON.parse(data);

const roc = ROC.calculate({ period: 12, values: prices });

const lastMonthPrices = prices.slice(-720);
const lastMonthMax = Math.max(...lastMonthPrices);
const lastMonthMin = Math.min(...lastMonthPrices);
const lastMonthAvg = lastMonthPrices.reduce((a, b) => a + b, 0) / lastMonthPrices.length;

const todayPrices = prices.slice(-24);
const todayMax = Math.max(...todayPrices);
const todayMin = Math.min(...todayPrices);
const todayAvg = todayPrices.reduce((a, b) => a + b, 0) / todayPrices.length;

const currentPrice = prices[prices.length - 1];

const trendSpeed = roc[roc.length - 1];
const volatility = (lastMonthMax - lastMonthMin) / lastMonthAvg;

let trend;
if (trendSpeed > 1) {
  trend = 'Восходящий';
} else if (trendSpeed < -1) {
  trend = 'Нисходящий';
} else {
  trend = 'Боковой';
}

let support;
if (currentPrice < todayMin) {
  support = todayMin;
} else if (currentPrice < lastMonthMin) {
  support = lastMonthMin;
} else {
  support = null;
}

let resistance;
if (currentPrice > todayMax) {
  resistance = todayMax;
} else if (currentPrice > lastMonthMax) {
  resistance = lastMonthMax;
} else {
  resistance = null;
}

console.log({
  trend,
  support,
  resistance,
  currentPrice,
  trendSpeed,
  volatility,
});
