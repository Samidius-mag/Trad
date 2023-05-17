const fs = require('fs');
const { EMA } = require('technicalindicators');

// Load price data from file
const prices = JSON.parse(fs.readFileSync('price.json'));

// Calculate price change velocity
const velocity = [];
for (let i = 1; i < prices.length; i++) {
  const change = prices[i].close - prices[i - 1].close;
  const time = prices[i].openTime - prices[i - 1].openTime;
  velocity.push(change / time);
}

// Calculate relative volatility index
const rvi = [];
for (let i = 0; i < prices.length; i++) {
  const high = prices[i].high;
  const low = prices[i].low;
  const close = prices[i].close;
  const rviValue = (high - close) / (high - low);
  rvi.push(rviValue);
}

// Calculate linear regression channel
const regressionPeriod = 20;
const regressionSlope = [];
const regressionIntercept = [];
for (let i = regressionPeriod; i < prices.length; i++) {
  const x = [];
  const y = [];
  for (let j = i - regressionPeriod; j < i; j++) {
    x.push(j);
    y.push(prices[j].close);
  }
  const regression = linearRegression(x, y);
  regressionSlope.push(regression.slope);
  regressionIntercept.push(regression.intercept);
}

// Calculate EMA
const ema21 = EMA.calculate({ period: 21, values: prices.map(p => p.close) });
const ema55 = EMA.calculate({ period: 55, values: prices.map(p => p.close) });
const ema89 = EMA.calculate({ period: 89, values: prices.map(p => p.close) });
const ema144 = EMA.calculate({ period: 144, values: prices.map(p => p.close) });
const ema233 = EMA.calculate({ period: 233, values: prices.map(p => p.close) });

// Calculate detrended price oscillator
const dpoPeriod = 20;
const dpo = [];
for (let i = dpoPeriod; i < prices.length; i++) {
  const dpoValue = prices[i].close - ema55[i - Math.floor(dpoPeriod / 2) - 1];
  dpo.push(dpoValue);
}

// Calculate trend direction for different timeframes
const trend1h = getTrend(prices, 1);
const trend4h = getTrend(prices, 4);
const trend12h = getTrend(prices, 12);
const trend24h = getTrend(prices, 24);

// Calculate support and resistance levels
const support1 = getSupportResistance(prices, 'support', 1);
const support2 = getSupportResistance(prices, 'support', 2);
const support3 = getSupportResistance(prices, 'support', 3);
const resistance1 = getSupportResistance(prices, 'resistance', 1);
const resistance2 = getSupportResistance(prices, 'resistance', 2);
const resistance3 = getSupportResistance(prices, 'resistance', 3);

// Calculate possible reversal points
const reversalPoints = getReversalPoints(prices);

// Calculate current price
const currentPrice = prices[prices.length - 1].close;

// Calculate current market sentiment
const marketSentiment = getMarketSentiment(prices);

// Make trading recommendation
const recommendation = getTradingRecommendation(prices);

// Print results
//console.log(`Активность: ${velocity}`);
//console.log(`Волатильность: ${rvi}`);
//console.log(`Канал н: ${regressionSlope}`);
//console.log(`Канал в: ${regressionIntercept}`);
//console.log(`ДПО: ${dpo}`);
console.log(`Тренд (1h): ${trend1h}`);
console.log(`Тренд (4h): ${trend4h}`);
console.log(`Тренд (12h): ${trend12h}`);
console.log(`Тренд (24h): ${trend24h}`);
console.log(`Поддержка: ${support1}, ${support2}, ${support3}`);
console.log(`Сопротивление: ${resistance1}, ${resistance2}, ${resistance3}`);
console.log(`Разворот: ${reversalPoints}`);
console.log(`Цена: ${currentPrice}`);
console.log(`Перекуп\Перепрод: ${marketSentiment}`);
console.log(`Рекомендую: ${recommendation}`);

// Helper function to calculate linear regression
function linearRegression(x, y) {
  const n = x.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
    sumYY += y[i] * y[i];
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

// Helper function to calculate trend direction for a given timeframe
function getTrend(prices, hours) {
  const period = hours * 60;
  const ema = EMA.calculate({ period, values: prices.map(p => p.close) });
  const currentPrice = prices[prices.length - 1].close;
  const emaValue = ema[ema.length - 1];
  if (currentPrice > emaValue) {
    return 'Восходящий';
  } else if (currentPrice < emaValue) {
    return 'Нисходящий';
  } else {
    return 'Боковой';
  }
}

// Helper function to calculate support and resistance levels
function getSupportResistance(prices, type, level) {
  const highs = prices.map(p => p.high);
  const lows = prices.map(p => p.low);
  const closes = prices.map(p => p.close);
  const pivot = (highs[0] + lows[0] + closes[0]) / 3;
  const r1 = 2 * pivot - lows[0];
  const s1 = 2 * pivot - highs[0];
  const r2 = pivot + (highs[0] - lows[0]);
  const s2 = pivot - (highs[0] - lows[0]);
  const r3 = highs[0] + 2 * (pivot - lows[0]);
  const s3 = lows[0] - 2 * (highs[0] - pivot);
  if (type === 'support') {
    if (level === 1) {
      return s1;
    } else if (level === 2) {
      return s2;
    } else if (level === 3) {
      return s3;
    }
  } else if (type === 'resistance') {
    if (level === 1) {
      return r1;
    } else if (level === 2) {
      return r2;
    } else if (level === 3) {
      return r3;
    }
  }
}

// Helper function to calculate possible reversal points
function getReversalPoints(prices) {
  const highs = prices.map(p => p.high);
  const lows = prices.map(p => p.low);
  const closes = prices.map(p => p.close);
  const pivot = (highs[0] + lows[0] + closes[0]) / 3;
  const r1 = 2 * pivot - lows[0];
  const s1 = 2 * pivot - highs[0];
  const r2 = pivot + (highs[0] - lows[0]);
  const s2 = pivot - (highs[0] - lows[0]);
  const r3 = highs[0] + 2 * (pivot - lows[0]);
  const s3 = lows[0] - 2 * (highs[0] - pivot);
  const reversalPoints = [];
  if (closes[0] < s1) {
    reversalPoints.push(s1);
  }
  if (closes[0] < s2) {
    reversalPoints.push(s2);
  }
  if (closes[0] < s3) {
    reversalPoints.push(s3);
  }
  if (closes[0] > r1) {
    reversalPoints.push(r1);
  }
  if (closes[0] > r2) {
    reversalPoints.push(r2);
  }
  if (closes[0] > r3) {
    reversalPoints.push(r3);
  }
  return reversalPoints;
}

// Helper function to calculate current market sentiment
function getMarketSentiment(prices) {
  const highs = prices.map(p => p.high);
  const lows = prices.map(p => p.low);
  const closes = prices.map(p => p.close);
  const pivot = (highs[0] + lows[0] + closes[0]) / 3;
  const r1 = 2 * pivot - lows[0];
  const s1 = 2 * pivot - highs[0];
  const r2 = pivot + (highs[0] - lows[0]);
  const s2 = pivot - (highs[0] - lows[0]);
  const r3 = highs[0] + 2 * (pivot - lows[0]);
  const s3 = lows[0] - 2 * (highs[0] - pivot);
  const sentiment = (closes[0] - s1) / (r1 - s1);
  return sentiment;
}

// Helper function to make trading recommendation
function getTradingRecommendation(prices) {
  const highs = prices.map(p => p.high);
  const lows = prices.map(p => p.low);
  const closes = prices.map(p => p.close);
  const pivot = (highs[0] + lows[0] + closes[0]) / 3;
  const r1 = 2 * pivot - lows[0];
  const s1 = 2 * pivot - highs[0];
  const r2 = pivot + (highs[0] - lows[0]);
  const s2 = pivot - (highs[0] - lows[0]);
  const r3 = highs[0] + 2 * (pivot - lows[0]);
  const s3 = lows[0] - 2 * (highs[0] - pivot);
  const sentiment = (closes[0] - s1) / (r1 - s1);
  if (sentiment < 0.2) {
    return 'Покупать';
  } else if (sentiment > 0.8) {
    return 'Продавать';
  } else {
    return 'Ждать';
  }
}
