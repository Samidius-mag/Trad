const fs = require('fs');
const { EMA } = require('technicalindicators');

const data = JSON.parse(fs.readFileSync('price.json'));

// определение скорости изменения цены
const priceChangeSpeed = (priceArray, hours) => {
  const priceNow = priceArray[priceArray.length - 1].close;
  const priceThen = priceArray[priceArray.length - 1 - hours].close;
  return (priceNow - priceThen) / priceThen;
};

// относительный индекс волатильности
const relativeVolatilityIndex = (priceArray, hours) => {
  const priceHigh = Math.max(...priceArray.slice(-hours).map(candle => candle.high));
  const priceLow = Math.min(...priceArray.slice(-hours).map(candle => candle.low));
  const priceRange = priceHigh - priceLow;
  const priceClose = priceArray[priceArray.length - 1].close;
  return (priceClose - priceLow) / priceRange;
};

// линейный регрессионный канал
const linearRegressionChannel = (priceArray, hours) => {
  const prices = priceArray.slice(-hours).map(candle => candle.close);
  const x = prices.map((price, index) => index);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = prices.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, index) => a + b * prices[index], 0);
  const sumX2 = x.reduce((a, b) => a + b ** 2, 0);
  const n = prices.length;
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const intercept = (sumY - slope * sumX) / n;
  const upperChannel = prices.map((price, index) => slope * index + intercept + 2 * priceRange(prices, index));
  const lowerChannel = prices.map((price, index) => slope * index + intercept - 2 * priceRange(prices, index));
  return { upperChannel, lowerChannel };
};

// функция для вычисления ценового диапазона
const priceRange = (prices, index) => {
  const pricesInRange = prices.slice(Math.max(0, index - 20), index + 1);
  const priceHigh = Math.max(...pricesInRange);
  const priceLow = Math.min(...pricesInRange);
  return priceHigh - priceLow;
};

// EMA 21, 55, 89, 144, 233
const ema21 = EMA.calculate({ period: 21, values: data.map(candle => candle.close) });
const ema55 = EMA.calculate({ period: 55, values: data.map(candle => candle.close) });
const ema89 = EMA.calculate({ period: 89, values: data.map(candle => candle.close) });
const ema144 = EMA.calculate({ period: 144, values: data.map(candle => candle.close) });
const ema233 = EMA.calculate({ period: 233, values: data.map(candle => candle.close) });

// направление тренда
const trendDirection = (priceArray, hours) => {
  const priceNow = priceArray[priceArray.length - 1].close;
  const priceThen = priceArray[priceArray.length - 1 - hours].close;
  if (priceNow > priceThen) {
    return 'восходящий';
  } else if (priceNow < priceThen) {
    return 'нисходящий';
  } else {
    return 'боковой';
  }
};

// уровни поддержки и сопротивления
const supportResistanceLevels = (priceArray, hours) => {
  const prices = priceArray.slice(-hours).map(candle => candle.close);
  const priceHigh = Math.max(...prices);
  const priceLow = Math.min(...prices);
  const priceRange = priceHigh - priceLow;
  const support1 = priceLow + 0.236 * priceRange;
  const support2 = priceLow + 0.382 * priceRange;
  const support3 = priceLow + 0.618 * priceRange;
  const resistance1 = priceHigh - 0.236 * priceRange;
  const resistance2 = priceHigh - 0.382 * priceRange;
  const resistance3 = priceHigh - 0.618 * priceRange;
  return { support1, support2, support3, resistance1, resistance2, resistance3 };
};

// возможные точки разворота рынка
const possibleReversalPoints = (priceArray, hours) => {
  const prices = priceArray.slice(-hours).map(candle => candle.close);
  const priceHigh = Math.max(...prices);
  const priceLow = Math.min(...prices);
  const priceRange = priceHigh - priceLow;
  const reversal1 = priceLow + 0.236 * priceRange;
  const reversal2 = priceLow + 0.382 * priceRange;
  const reversal3 = priceLow + 0.5 * priceRange;
  const reversal4 = priceLow + 0.618 * priceRange;
  const reversal5 = priceLow + 0.786 * priceRange;
  const reversal6 = priceLow + priceRange;
  return { reversal1, reversal2, reversal3, reversal4, reversal5, reversal6 };
};

// текущая цена
const currentPrice = data[data.length - 1].close;

// текущая перекупленность/перепроданность рынка
const currentOverboughtOversold = (priceArray, hours) => {
  const prices = priceArray.slice(-hours).map(candle => candle.close);
  const priceHigh = Math.max(...prices);
  const priceLow = Math.min(...prices);
  const priceRange = priceHigh - priceLow;
  const priceClose = prices[prices.length - 1];
  const overbought = (priceClose - priceLow) / priceRange;
  const oversold = (priceHigh - priceClose) / priceRange;
  return { overbought, oversold };
};

// рекомендация о покупке/продаже, или ожидании
const recommendation = (priceArray, hours) => {
  const priceNow = priceArray[priceArray.length - 1].close;
  const priceThen = priceArray[priceArray.length - 1 - hours].close;
  if (priceNow > priceThen) {
    return 'покупать';
  } else if (priceNow < priceThen) {
    return 'продавать';
  } else {
    return 'ожидать';
  }
};
