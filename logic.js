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
  const monthlyTrend = monthlyMaxPrice > monthlyMinPrice ? 'восходящий' : (monthlyMaxPrice < monthlyMinPrice ? 'нисходящий' : 'боковой');
  const dailyTrend = dailyMaxPrice > dailyMinPrice ? 'восходящий' : (dailyMaxPrice < dailyMinPrice ? 'нисходящий' : 'боковой');
  const currentTrend = currentPrice > dailyMaxPrice ? 'восходящий' : (currentPrice < dailyMinPrice ? 'нисходящий' : 'боковой');
  let currentSupport;
  if (currentTrend === 'восходящий') {
    const currentPrices = prices.slice(-24);
    const currentMinPrice = Math.min(...currentPrices);
    currentSupport = currentMinPrice;
  } else if (currentTrend === 'нисходящий') {
    const currentPrices = prices.slice(-24);
    const currentMaxPrice = Math.max(...currentPrices);
    currentSupport = currentMaxPrice;
  } else {
    currentSupport = support;
  }
  let currentResistance;
  if (currentTrend === 'восходящий') {
    const currentPrices = prices.slice(-24);
    const currentMaxPrice = Math.max(...currentPrices);
    currentResistance = currentMaxPrice;
  } else if (currentTrend === 'нисходящий') {
    const currentPrices = prices.slice(-24);
    const currentMinPrice = Math.min(...currentPrices);
    currentResistance = currentMinPrice;
  } else {
    currentResistance = resistance;
  }
  let dailySupport;
  if (dailyTrend === 'восходящий') {
    const dailyPrices = prices.slice(-24 * 7);
    const dailyMinPrice = Math.min(...dailyPrices);
    dailySupport = dailyMinPrice;
  } else if (dailyTrend === 'нисходящий') {
    const dailyPrices = prices.slice(-24 * 7);
    const dailyMaxPrice = Math.max(...dailyPrices);
    dailySupport = dailyMaxPrice;
  } else {
    dailySupport = support;
  }
  let dailyResistance;
  if (dailyTrend === 'восходящий') {
    const dailyPrices = prices.slice(-24 * 7);
    const dailyMaxPrice = Math.max(...dailyPrices);
    dailyResistance = dailyMaxPrice;
  } else if (dailyTrend === 'нисходящий') {
    const dailyPrices = prices.slice(-24 * 7);
    const dailyMinPrice = Math.min(...dailyPrices);
    dailyResistance = dailyMinPrice;
  } else {
    dailyResistance = resistance;
  }
  let monthlySupport;
  if (monthlyTrend === 'восходящий') {
    const monthlyPrices = prices.slice(-24 * 30);
    const monthlyMinPrice = Math.min(...monthlyPrices);
    monthlySupport = monthlyMinPrice;
  } else if (monthlyTrend === 'нисходящий') {
    const monthlyPrices = prices.slice(-24 * 30);
    const monthlyMaxPrice = Math.max(...monthlyPrices);
    monthlySupport = monthlyMaxPrice;
  } else {
    monthlySupport = support;
  }
  let monthlyResistance;
  if (monthlyTrend === 'восходящий') {
    const monthlyPrices = prices.slice(-24 * 30);
    const monthlyMaxPrice = Math.max(...monthlyPrices);
    monthlyResistance = monthlyMaxPrice;
  } else if (monthlyTrend === 'нисходящий') {
    const monthlyPrices = prices.slice(-24 * 30);
    const monthlyMinPrice = Math.min(...monthlyPrices);
    monthlyResistance = monthlyMinPrice;
  } else {
    monthlyResistance = resistance;
  }
  return { support, resistance, currentPrice, currentSupport, currentResistance, dailySupport, dailyResistance, monthlySupport, monthlyResistance };
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
  const { support, resistance, currentPrice, currentSupport, currentResistance, dailySupport, dailyResistance, monthlySupport, monthlyResistance } = calculateSupportResistance(prices);
  const { monthlyTrend, dailyTrend, currentTrend } = calculateTrend(prices);
  console.log(`Активность рынка: ${marketActivity.toFixed(2)}%`);
  console.log(`Волатильность: ${volatility.toFixed(2)}%`);
  console.log(`Уровень поддержки: ${support.toFixed(2)}`);
  console.log(`Уровень сопротивления: ${resistance.toFixed(2)}`);
  console.log(`Месячный тренд: ${monthlyTrend}`);
  console.log(`Дневной тренд: ${dailyTrend}`);
  console.log(`Текущий тренд: ${currentTrend}`);
  console.log(`Текущая цена: ${currentPrice.toFixed(2)}`);
  console.log(`Уровень поддержки для текущего тренда: ${currentSupport.toFixed(2)}`);
  console.log(`Уровень сопротивления для текущего тренда: ${currentResistance.toFixed(2)}`);
  console.log(`Уровень поддержки для дневного тренда: ${dailySupport.toFixed(2)}`);
  console.log(`Уровень сопротивления для дневного тренда: ${dailyResistance.toFixed(2)}`);
  console.log(`Уровень поддержки для месячного тренда: ${monthlySupport.toFixed(2)}`);
  console.log(`Уровень сопротивления для месячного тренда: ${monthlyResistance.toFixed(2)}`);
});


  

  
    
    

  
