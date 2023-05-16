const fs = require('fs');

const calculateActivity = (prices) => {
  const currentPrice = prices[prices.length - 1];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const activity = ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100;
  return activity.toFixed(2);
};

const calculateVolatility = (prices) => {
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const volatility = ((maxPrice - minPrice) / minPrice) * 100;
  return volatility.toFixed(2);
};

const calculateSupportResistanceLevels = (prices) => {
  const monthPrices = prices.slice(-720);
  const monthHigh = Math.max(...monthPrices);
  const monthLow = Math.min(...monthPrices);
  const monthRange = monthHigh - monthLow;
  const monthSupport = monthLow + monthRange * 0.382;
  const monthResistance = monthLow + monthRange * 0.618;

  const dayPrices = prices.slice(-24);
  const dayHigh = Math.max(...dayPrices);
  const dayLow = Math.min(...dayPrices);
  const dayRange = dayHigh - dayLow;
  const daySupport = dayLow + dayRange * 0.382;
  const dayResistance = dayLow + dayRange * 0.618;

  const currentPrice = prices[prices.length - 1];
  const currentRange = dayHigh - dayLow;
  const currentSupport = currentPrice - currentRange * 0.382;
  const currentResistance = currentPrice + currentRange * 0.618;

  return {
    monthSupport,
    monthResistance,
    daySupport,
    dayResistance,
    currentSupport,
    currentResistance,
  };
};

const calculateTrend = (prices) => {
  const activity = calculateActivity(prices);
  const trend = {
    month: 'боковой',
    day: 'боковой',
    current: 'боковой',
  };

  if (activity >= 25) {
    const monthPrices = prices.slice(-720);
    const monthHigh = Math.max(...monthPrices);
    const monthLow = Math.min(...monthPrices);
    const monthClose = monthPrices[monthPrices.length - 1];
    const monthRange = monthHigh - monthLow;
    const monthMiddle = monthLow + monthRange * 0.5;

    if (monthClose > monthMiddle) {
      trend.month = 'восходящий';
    } else if (monthClose < monthMiddle) {
      trend.month = 'нисходящий';
    }

    const dayPrices = prices.slice(-24);
    const dayHigh = Math.max(...dayPrices);
    const dayLow = Math.min(...dayPrices);
    const dayClose = dayPrices[dayPrices.length - 1];
    const dayRange = dayHigh - dayLow;
    const dayMiddle = dayLow + dayRange * 0.5;

    if (dayClose > dayMiddle) {
      trend.day = 'восходящий';
    } else if (dayClose < dayMiddle) {
      trend.day = 'нисходящий';
    }

    const currentPrice = prices[prices.length - 1];
    const currentHigh = dayHigh;
    const currentLow = dayLow;
    const currentRange = currentHigh - currentLow;
    const currentMiddle = currentLow + currentRange * 0.5;

    if (currentPrice > currentMiddle) {
      trend.current = 'восходящий';
    } else if (currentPrice < currentMiddle) {
      trend.current = 'нисходящий';
    }
  }

  return trend;
};

const calculateCurrentPrice = (prices) => {
  const currentPrice = prices[prices.length - 1];
  return currentPrice;
};

fs.readFile('price.json', (err, data) => {
  if (err) throw err;
  const prices = JSON.parse(data).map(candle => candle[4]);

  const activity = calculateActivity(prices);
  const volatility = calculateVolatility(prices);
  const supportResistanceLevels = calculateSupportResistanceLevels(prices);
  const trend = calculateTrend(prices);
  const currentPrice = calculateCurrentPrice(prices);

  console.log('Активность рынка:', activity, '%');
  console.log('Волатильность рынка:', volatility, '%');
  console.log('Уровни поддержки и сопротивления:');
  console.log('Месячный период:');
  console.log('Поддержка:', supportResistanceLevels.monthSupport.toFixed(2));
  console.log('Сопротивление:', supportResistanceLevels.monthResistance.toFixed(2));
  console.log('Текущий день:');
  console.log('Поддержка:', supportResistanceLevels.daySupport.toFixed(2));
  console.log('Сопротивление:', supportResistanceLevels.dayResistance.toFixed(2));
  console.log('Текущий период:');
  console.log('Поддержка:', supportResistanceLevels.currentSupport.toFixed(2));
  console.log('Сопротивление:', supportResistanceLevels.currentResistance.toFixed(2));
  console.log('Месячный тренд:', trend.month);
  console.log('Дневной тренд:', trend.day);
  console.log('Текущий тренд:', trend.current);
  console.log('Текущая цена:', currentPrice.toFixed(2));
  console.log('Активность и волатильность в %:');
  console.log(activity, '%', volatility, '%');
});
   
