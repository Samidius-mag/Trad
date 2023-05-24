const fs = require('fs');
const { SMA, EMA, MACD, RSI, Stochastic } = require('technicalindicators');

const data = JSON.parse(fs.readFileSync('price.json'));

// Функция для вычисления индикаторов
function calculateIndicators(prices) {
  const sma3 = SMA.calculate({ period: 30, values: prices });
  const sma6 = SMA.calculate({ period: 60, values: prices });
  const sma9 = SMA.calculate({ period: 90, values: prices });
  const ema3 = EMA.calculate({ period: 30, values: prices });
  const ema6 = EMA.calculate({ period: 60, values: prices });
  const ema9 = EMA.calculate({ period: 90, values: prices });
  const macd = MACD.calculate({ values: prices, fastPeriod: 18, slowPeriod: 36, signalPeriod: 9 });
  const rsi = RSI.calculate({ period: 18, values: prices });
  const stoch = Stochastic.calculate({ period: 18, high: prices, low: prices, close: prices, signalPeriod: 3 });

  return { sma3, sma6, sma9, ema3, ema6, ema9, macd, rsi, stoch };
}

// Вычисляем индикаторы для всех свечей
const indicators = calculateIndicators(data.map(candle => candle.close));

// Функция для определения направления тренда
function getTrendDirection(indicatorValues) {
  const lastValue = indicatorValues[indicatorValues.length - 1];
  const prevValue = indicatorValues[indicatorValues.length - 2];

  if (lastValue > prevValue) {
    return 'up';
  } else if (lastValue < prevValue) {
    return 'down';
  } else {
    return 'flat';
  }
}

// Определяем направление тренда для каждого индикатора
const trendDirections = {
  sma3: getTrendDirection(indicators.sma3),
  sma6: getTrendDirection(indicators.sma6),
  sma9: getTrendDirection(indicators.sma9),
  ema3: getTrendDirection(indicators.ema3),
  ema6: getTrendDirection(indicators.ema6),
  ema9: getTrendDirection(indicators.ema9),
  macd: getTrendDirection(indicators.macd.map(item => item.histogram)),
  rsi: getTrendDirection(indicators.rsi),
  stoch: getTrendDirection(indicators.stoch.map(item => item.d)),
};

// Функция для определения ценовых показателей входа и выхода из сделок
function getEntryExitPrices(prices, indicatorValues, trendDirection) {
  const entryPrices = [];
  const exitPrices = [];

  for (let i = 1; i < indicatorValues.length; i++) {
    const prevValue = indicatorValues[i - 1];
    const currValue = indicatorValues[i];
    const prevPrice = prices[i - 1];
    const currPrice = prices[i];

    if (trendDirection === 'up' && prevValue < 0 && currValue > 0) {
      entryPrices.push(currPrice.toFixed(2));
    } else if (trendDirection === 'down' && prevValue > 0 && currValue < 0) {
      entryPrices.push(currPrice.toFixed(2));
    } else if (trendDirection === 'up' && prevValue > 0 && currValue < 0) {
      exitPrices.push(currPrice.toFixed(2));
    } else if (trendDirection === 'down' && prevValue < 0 && currValue > 0) {
      exitPrices.push(currPrice.toFixed(2));
    }
  }

  return { entryPrices, exitPrices };
}

// Фильтруем минимальные и максимальные значения
const minEntryPrice = Math.min(...entryPrices).toFixed(2);
const maxEntryPrice = Math.max(...entryPrices).toFixed(2);
const minExitPrice = Math.min(...exitPrices).toFixed(2);
const maxExitPrice = Math.max(...exitPrices).toFixed(2);

return { minEntryPrice, maxEntryPrice, minExitPrice, maxExitPrice };
}

// Определяем ценовые показатели входа и выхода для каждого индикатора
const entryExitPrices = {
sma3: getEntryExitPrices(data.map(candle => candle.close), indicators.sma3, trendDirections.sma3),
sma6: getEntryExitPrices(data.map(candle => candle.close), indicators.sma6, trendDirections.sma6),
sma9: getEntryExitPrices(data.map(candle => candle.close), indicators.sma9, trendDirections.sma9),
ema3: getEntryExitPrices(data.map(candle => candle.close), indicators.ema3, trendDirections.ema3),
ema6: getEntryExitPrices(data.map(candle => candle.close), indicators.ema6, trendDirections.ema6),
ema9: getEntryExitPrices(data.map(candle => candle.close), indicators.ema9, trendDirections.ema9),
macd: getEntryExitPrices(data.map(candle => candle.close), indicators.macd.map(item => item.histogram), trendDirections.macd),
rsi: getEntryExitPrices(data.map(candle => candle.close), indicators.rsi, trendDirections.rsi),
stoch: getEntryExitPrices(data.map(candle => candle.close), indicators.stoch.map(item => item.d), trendDirections.stoch),
};

// Функция для определения уровней отскока
function getBounceLevels(prices) {
const maxPrice = Math.max(...prices);
const minPrice = Math.min(...prices);
const range = maxPrice - minPrice;
const level1 = (minPrice + range * 0.236).toFixed(2);
const level2 = (minPrice + range * 0.382).toFixed(2);
const level3 = (minPrice + range * 0.5).toFixed(2);
const level4 = (minPrice + range * 0.618).toFixed(2);
const level5 = (minPrice + range * 0.764).toFixed(2);

return { level1, level2, level3, level4, level5 };
}

// Определяем уровни отскока для текущей цены и для идущего тренда
const currentPrice = data[data.length - 1].close.toFixed(2);
const currentBounceLevels = getBounceLevels(data.slice(-108).map(candle => candle.close));
const trendBounceLevels = getBounceLevels(data.slice(-216).map(candle => candle.close));

// Функция для определения точек разворота
function getReversalPoints(prices) {
const maxPrice = Math.max(...prices);
const minPrice = Math.min(...prices);
const range = maxPrice - minPrice;
const level1 = minPrice + range * 0.236;
const level2 = minPrice + range * 0.382;
const level3 = minPrice + range * 0.5;
const level4 = minPrice + range * 0.618;
const level5 = minPrice + range * 0.764;

const reversalPoints = [];

for (let i = 1; i < prices.length - 1; i++) {
const prevPrice = prices[i - 1];
const currPrice = prices[i];
const nextPrice = prices[i + 1];


if (prevPrice < currPrice && currPrice > nextPrice && currPrice >= level3) {
  reversalPoints.push(currPrice);
} else if (prevPrice > currPrice && currPrice < nextPrice && currPrice <= level3) {
  reversalPoints.push(currPrice);
}
}

// Фильтруем минимальные и максимальные значения
const minReversalPoint = Math.min(...reversalPoints).toFixed(2);
const maxReversalPoint = Math.max(...reversalPoints).toFixed(2);

return { minReversalPoint, maxReversalPoint };
}

// Определяем точки разворота для текущей цены и для идущего тренда
const currentReversalPoints = getReversalPoints(data.slice(-108).map(candle => candle.close));
const trendReversalPoints = getReversalPoints(data.slice(-216).map(candle => candle.close));

console.log('Trend directions:', trendDirections);
console.log('Entry/exit prices:', entryExitPrices);
console.log('Current price bounce levels:', currentBounceLevels);
console.log('Trend bounce levels:', trendBounceLevels);
console.log('Current price reversal points:', currentReversalPoints);
console.log('Trend reversal points:', trendReversalPoints);

