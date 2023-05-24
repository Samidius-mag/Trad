const fs = require('fs');
const { SMA, EMA, MACD, RSI, Stochastic } = require('technicalindicators');

const data = JSON.parse(fs.readFileSync('price.json'));

// Функция для вычисления индикаторов
function calculateIndicators(prices) {
  const sma3 = SMA.calculate({ period: 3, values: prices });
  const sma6 = SMA.calculate({ period: 6, values: prices });
  const sma9 = SMA.calculate({ period: 9, values: prices });
  const ema3 = EMA.calculate({ period: 3, values: prices });
  const ema6 = EMA.calculate({ period: 6, values: prices });
  const ema9 = EMA.calculate({ period: 9, values: prices });
  const macd = MACD.calculate({ values: prices, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
  const rsi = RSI.calculate({ period: 14, values: prices });
  const stoch = Stochastic.calculate({ period: 14, high: prices, low: prices, close: prices, signalPeriod: 3 });

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

// Функция для определения точек входа и выхода из сделок
function getEntryExitPoints(indicatorValues, trendDirection) {
  const entryPoints = [];
  const exitPoints = [];

  for (let i = 1; i < indicatorValues.length; i++) {
    const prevValue = indicatorValues[i - 1];
    const currValue = indicatorValues[i];

    if (trendDirection === 'up' && prevValue < 0 && currValue > 0) {
      entryPoints.push(i);
    } else if (trendDirection === 'down' && prevValue > 0 && currValue < 0) {
      entryPoints.push(i);
    } else if (trendDirection === 'up' && prevValue > 0 && currValue < 0) {
      exitPoints.push(i);
    } else if (trendDirection === 'down' && prevValue < 0 && currValue > 0) {
      exitPoints.push(i);
    }
  }

  return { entryPoints, exitPoints };
}

// Определяем точки входа и выхода для каждого индикатора
const entryExitPoints = {
  sma3: getEntryExitPoints(indicators.sma3, trendDirections.sma3),
  sma6: getEntryExitPoints(indicators.sma6, trendDirections.sma6),
  sma9: getEntryExitPoints(indicators.sma9, trendDirections.sma9),
  ema3: getEntryExitPoints(indicators.ema3, trendDirections.ema3),
  ema6: getEntryExitPoints(indicators.ema6, trendDirections.ema6),
  ema9: getEntryExitPoints(indicators.ema9, trendDirections.ema9),
  macd: getEntryExitPoints(indicators.macd.map(item => item.histogram), trendDirections.macd),
  rsi: getEntryExitPoints(indicators.rsi, trendDirections.rsi),
  stoch: getEntryExitPoints(indicators.stoch.map(item => item.d), trendDirections.stoch),
};

// Функция для определения уровней отскока
function getBounceLevels(prices) {
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const range = maxPrice - minPrice;
  const level1 = minPrice + range * 0.236;
  const level2 = minPrice + range * 0.382;
  const level3 = minPrice + range * 0.5;
  const level4 = minPrice + range * 0.618;
  const level5 = minPrice + range * 0.764;

  return { level1, level2, level3, level4, level5 };
}

// Определяем уровни отскока для текущей цены и для идущего тренда
const currentPrice = data[data.length - 1].close;
const currentBounceLevels = getBounceLevels(data.slice(-100).map(candle => candle.close));
const trendBounceLevels = getBounceLevels(data.slice(-200).map(candle => candle.close));

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
      reversalPoints.push(i);
    } else if (prevPrice > currPrice && currPrice < nextPrice && currPrice <= level3) {
      reversalPoints.push(i);
    }
  }

  return reversalPoints;
}

// Определяем точки разворота для текущей цены и для идущего тренда
const currentReversalPoints = getReversalPoints(data.slice(-100).map(candle => candle.close));
const trendReversalPoints = getReversalPoints(data.slice(-200).map(candle => candle.close));

console.log('Trend directions:', trendDirections);
console.log('Entry/exit points:', entryExitPoints);
console.log('Current price bounce levels:', currentBounceLevels);
console.log('Trend bounce levels:', trendBounceLevels);
console.log('Current price reversal points:', currentReversalPoints);
console.log('Trend reversal points:', trendReversalPoints);
