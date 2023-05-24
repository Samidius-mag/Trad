const fs = require('fs');
const { RSI, PSAR, EMA, SMA } = require('technicalindicators');

const PRICE_FILE = 'price.json';
const PRICE_MULTIPLIER = 49248;

const loadPriceData = () => {
  const rawData = fs.readFileSync(PRICE_FILE);
  return JSON.parse(rawData);
};

const getPriceData = () => {
  const priceData = loadPriceData();
  return priceData.map(candle => parseFloat(candle.close));
};

const getTrendDirection = (priceData) => {
  const currentPrice = priceData[priceData.length - 1];
  const previousPrice = priceData[priceData.length - 2];
  if (currentPrice > previousPrice) {
    return 'up';
  } else if (currentPrice < previousPrice) {
    return 'down';
  } else {
    return 'sideways';
  }
};

const getFuturePriceDirection = (priceData, hours) => {
  const currentPrice = priceData[priceData.length - 1];
  const futurePrice = priceData[priceData.length - 1 + hours];
  if (futurePrice > currentPrice) {
    return 'up';
  } else if (futurePrice < currentPrice) {
    return 'down';
  } else {
    return 'sideways';
  }
};

const getEntryExitPoints = (priceData, hours) => {
  const currentPrice = priceData[priceData.length - 1];
  const futurePrice = priceData[priceData.length - 1 + hours];
  if (futurePrice > currentPrice) {
    const stopLoss = currentPrice - (currentPrice * 0.02);
    const takeProfit = futurePrice + (futurePrice * 0.05);
    return { entry: currentPrice, stopLoss, takeProfit };
  } else if (futurePrice < currentPrice) {
    const stopLoss = currentPrice + (currentPrice * 0.02);
    const takeProfit = futurePrice - (futurePrice * 0.05);
    return { entry: currentPrice, stopLoss, takeProfit };
  } else {
    return null;
  }
};

const getIndicators = (priceData) => {
  const rsi = RSI.calculate({ values: priceData, period: PRICE_MULTIPLIER });
  const psar = PSAR.calculate({ high: priceData.map(p => p + 100), low: priceData.map(p => p - 100), step: 0.02, max: 0.2 });
  const ema = EMA.calculate({ values: priceData, period: PRICE_MULTIPLIER });
  const sma = SMA.calculate({ values: priceData, period: PRICE_MULTIPLIER });
  return { rsi, psar, ema, sma };
};

const priceData = getPriceData();
const trendDirection = getTrendDirection(priceData);
const futurePriceDirection4h = getFuturePriceDirection(priceData, 4);
const futurePriceDirection12h = getFuturePriceDirection(priceData, 12);
const futurePriceDirection24h = getFuturePriceDirection(priceData, 24);
const entryExitPoints4h = getEntryExitPoints(priceData, 4);
const entryExitPoints12h = getEntryExitPoints(priceData, 12);
const entryExitPoints24h = getEntryExitPoints(priceData, 24);
const indicators = getIndicators(priceData);

console.log('Trend direction:', trendDirection);
console.log('Future price direction in 4 hours:', futurePriceDirection4h);
console.log('Future price direction in 12 hours:', futurePriceDirection12h);
console.log('Future price direction in 24 hours:', futurePriceDirection24h);
console.log('Entry/exit points for 4 hours:', entryExitPoints4h);
console.log('Entry/exit points for 12 hours:', entryExitPoints12h);
console.log('Entry/exit points for 24 hours:', entryExitPoints24h);
console.log('RSI:', indicators.rsi);
console.log('PSAR:', indicators.psar);
console.log('EMA:', indicators.ema);
console.log('SMA:', indicators.sma);
