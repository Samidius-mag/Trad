const fs = require('fs');

const prices = JSON.parse(fs.readFileSync('price.json'));

const monthPrices = prices.slice(-720); // 720 часовых свечей = месяц

const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

const currentPrice = prices[prices.length - 1];
const monthAverage = average(monthPrices);
const trend = currentPrice > monthAverage ? 'восходящий' : currentPrice < monthAverage ? 'нисходящий' : 'боковой';
const volatility = Math.round(100 * (Math.max(...prices) - Math.min(...prices)) / monthAverage);
const support = Math.min(...monthPrices);
const resistance = Math.max(...monthPrices);

console.log(`Текущая цена: ${currentPrice}`);
console.log(`Текущий тренд: ${trend}`);
console.log(`Волатильность: ${volatility}%`);
console.log(`Уровень поддержки: ${support}`);
console.log(`Уровень сопротивления: ${resistance}`);
