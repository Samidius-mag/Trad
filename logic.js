const fs = require('fs');

const calculateMarketActivity = (candles) => {
  const averageVolume = candles.reduce((sum, candle) => sum + candle.volume, 0) / candles.length;
  const currentVolume = candles[candles.length - 1].volume;
  const activity = currentVolume / averageVolume * 100;
  return activity;
};

const calculateMarketVolatility = (candles) => {
  const maxHigh = Math.max(...candles.map(candle => candle.high));
  const minLow = Math.min(...candles.map(candle => candle.low));
  const volatility = (maxHigh - minLow) / maxHigh * 100;
  return volatility;
};

const calculateSupportResistanceLevels = (candles) => {
  const monthCandles = candles.slice(-720);
  const monthHigh = Math.max(...monthCandles.map(candle => candle.high));
  const monthLow = Math.min(...monthCandles.map(candle => candle.low));
  const monthRange = monthHigh - monthLow;
  const monthSupport = monthLow + monthRange * 0.382;
  const monthResistance = monthLow + monthRange * 0.618;

  const dayCandles = candles.slice(-24);
  const dayHigh = Math.max(...dayCandles.map(candle => candle.high));
  const dayLow = Math.min(...dayCandles.map(candle => candle.low));
  const dayRange = dayHigh - dayLow;
  const daySupport = dayLow + dayRange * 0.382;
  const dayResistance = dayLow + dayRange * 0.618;

  const currentCandle = candles[candles.length - 1];
  const currentRange = currentCandle.high - currentCandle.low;
  const currentSupport = currentCandle.low + currentRange * 0.382;
  const currentResistance = currentCandle.low + currentRange * 0.618;

  return {
    monthSupport,
    monthResistance,
    daySupport,
    dayResistance,
    currentSupport,
    currentResistance,
  };
};

const calculateTrend = (candles) => {
  const activity = calculateMarketActivity(candles);
  const trend = {
    month: 'боковой',
    day: 'боковой',
    current: 'боковой',
  };

  if (activity >= 25) {
    const monthCandles = candles.slice(-720);
    const monthHigh = Math.max(...monthCandles.map(candle => candle.high));
    const monthLow = Math.min(...monthCandles.map(candle => candle.low));
    const monthClose = monthCandles[monthCandles.length - 1].close;
    const monthRange = monthHigh - monthLow;
    const monthMiddle = monthLow + monthRange * 0.5;

    if (monthClose > monthMiddle) {
      trend.month = 'восходящий';
    } else if (monthClose < monthMiddle) {
      trend.month = 'нисходящий';
    }

    const dayCandles = candles.slice(-24);
    const dayHigh = Math.max(...dayCandles.map(candle => candle.high));
    const dayLow = Math.min(...dayCandles.map(candle => candle.low));
    const dayClose = dayCandles[dayCandles.length - 1].close;
    const dayRange = dayHigh - dayLow;
    const dayMiddle = dayLow + dayRange * 0.5;

    if (dayClose > dayMiddle) {
      trend.day = 'восходящий';
    } else if (dayClose < dayMiddle) {
      trend.day = 'нисходящий';
    }

    const currentCandle = candles[candles.length - 1];
    const currentHigh = currentCandle.high;
    const currentLow = currentCandle.low;
    const currentClose = currentCandle.close;
    const currentRange = currentHigh - currentLow;
    const currentMiddle = currentLow + currentRange * 0.5;

    if (currentClose > currentMiddle) {
      trend.current = 'восходящий';
    } else if (currentClose < currentMiddle) {
      trend.current = 'нисходящий';
    }
  }

  return trend;
};

const calculateCurrentPrice = (candles) => {
  const currentPrice = candles[candles.length - 1].close;
  return currentPrice;
};

fs.readFile('price.json', (err, data) => {
  if (err) throw err;
  const candles = JSON.parse(data);

  const activity = calculateMarketActivity(candles);
  const volatility = calculateMarketVolatility(candles);
  const supportResistanceLevels = calculateSupportResistanceLevels(candles);
  const trend = calculateTrend(candles);
  const currentPrice = calculateCurrentPrice(candles);

  console.log('Активность рынка:', activity.toFixed(2), '%');
  console.log('Волатильность рынка:', volatility.toFixed(2), '%');
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
  console.log(activity.toFixed(2), '%', volatility.toFixed(2), '%');
});
