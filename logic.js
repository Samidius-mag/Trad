

const fs = require('fs');

const calculateMarketActivity = (prices) => {
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice;
  const threshold = range * 0.0025;
  const activePrices = prices.filter(price => Math.abs(price - minPrice) > threshold && Math.abs(price - maxPrice) > threshold);
  return activePrices.length / prices.length;
};

const calculateVolatility = (prices) => {
  const logReturns = [];
  for (let i = 1; i < prices.length; i++) {
    logReturns.push(Math.log(prices[i] / prices[i - 1]));
  }
  const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
  const variance = logReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / logReturns.length;
  return Math.sqrt(variance) * Math.sqrt(24 * 365);
};

const calculateSupportResistance = (prices) => {
  const monthlyPrices = prices.slice(-720);
  const monthlyMinPrice = Math.min(...monthlyPrices);
  const monthlyMaxPrice = Math.max(...monthlyPrices);
  const dailyPrices = prices.slice(-24);
  const dailyMinPrice = Math.min(...dailyPrices);
  const dailyMaxPrice = Math.max(...dailyPrices);
  const currentPrice = prices[prices.length - 1];
  const support = monthlyMinPrice < dailyMinPrice ? monthlyMinPrice : dailyMinPrice;
  const resistance = monthlyMaxPrice > dailyMaxPrice ? monthlyMaxPrice : dailyMaxPrice;
  return { support, resistance, currentPrice };
};

const calculateTrend = (prices) => {
  const monthlyPrices = prices.slice(-720);
  const monthlyMinPrice = Math.min(...monthlyPrices);
  const monthlyMaxPrice = Math.max(...monthlyPrices);
  const dailyPrices = prices.slice(-24);
  const dailyMinPrice = Math.min(...dailyPrices);
  const dailyMaxPrice = Math.max(...dailyPrices);
  const currentPrice = prices[prices.length - 1];
  const monthlyTrend = monthlyMaxPrice > monthlyMinPrice ? 'восходящий' : (monthlyMaxPrice < monthlyMinPrice ? 'нисходящий' : 'боковой');
  const dailyTrend = dailyMaxPrice > dailyMinPrice ? 'восходящий' : (dailyMaxPrice < dailyMinPrice ? 'нисходящий' : 'боковой');
  const currentTrend = currentPrice > dailyMaxPrice ? 'восходящий' : (currentPrice < dailyMinPrice ? 'нисходящий' : 'боковой');
  return { monthlyTrend, dailyTrend, currentTrend };
};

fs.readFile('price.json', (err, data) => {
  if (err) throw err;
  const prices = JSON.parse(data);
  const marketActivity = calculateMarketActivity(prices);
  const volatility = calculateVolatility(prices) * 100;
  const { support, resistance, currentPrice } = calculateSupportResistance(prices);
  const { monthlyTrend, dailyTrend, currentTrend } = calculateTrend(prices);
  console.log(`Активность рынка: ${marketActivity.toFixed(2)}%`);
  console.log(`Волатильность: ${volatility.toFixed(2)}%`);
  console.log(`Уровень поддержки: ${support.toFixed(2)}`);
  console.log(`Уровень сопротивления: ${resistance.toFixed(2)}`);
  console.log(`Месячный тренд: ${monthlyTrend}`);
  console.log(`Дневной тренд: ${dailyTrend}`);
  console.log(`Текущий тренд: ${currentTrend}`);
  console.log(`Текущая цена: ${currentPrice.toFixed(2)}`);
});
