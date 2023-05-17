const prices = require('./price.json');

function calculateEMA(prices, period) {
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * k + ema;
  }

  return ema;
}

function calculateSMA(prices, period) {
  return prices.slice(-period).reduce((sum, price) => sum + price, 0) / period;
}

function calculateFibonacciLevels(prices, period) {
  const high = Math.max(...prices.slice(-period).map(candle => candle.high));
  const low = Math.min(...prices.slice(-period).map(candle => candle.low));
  const range = high - low;
  const levels = [];

  for (let i = 0; i <= 13; i++) {
    const level = high - range * (i / 13);
    levels.push(level.toFixed(2));
  }

  return levels;
}

function calculateRSI(prices, period) {
  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);
  const avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
  const avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  return rsi;
}

const pricesClose = prices.map(candle => candle.close);
const currentPrice = prices[prices.length - 1].close;
const prevPrice = prices[prices.length - 2].close;
const priceChange = currentPrice - prevPrice;
const priceChangePercent = (priceChange / prevPrice) * 100;
const ema21 = calculateEMA(pricesClose, 21);
const ema55 = calculateEMA(pricesClose, 55);
const ema89 = calculateEMA(pricesClose, 89);
const ema144 = calculateEMA(pricesClose, 144);
const ema233 = calculateEMA(pricesClose, 233);
const sma1h = calculateSMA(pricesClose, 1);
const sma4h = calculateSMA(pricesClose, 4);
const sma12h = calculateSMA(pricesClose, 12);
const sma24h = calculateSMA(pricesClose, 24);
const trend1h = currentPrice > sma1h ? 'восходящий' : currentPrice < sma1h ? 'нисходящий' : 'боковой';
const trend4h = currentPrice > sma4h ? 'восходящий' : currentPrice < sma4h ? 'нисходящий' : 'боковой';
const trend12h = currentPrice > sma12h ? 'восходящий' : currentPrice < sma12h ? 'нисходящий' : 'боковой';
const trend24h = currentPrice > sma24h ? 'восходящий' : currentPrice < sma24h ? 'нисходящий' : 'боковой';
const fib21 = calculateFibonacciLevels(prices, 21);
const fib55 = calculateFibonacciLevels(prices, 55);
const fib89 = calculateFibonacciLevels(prices, 89);
const fib144 = calculateFibonacciLevels(prices, 144);
const fib233 = calculateFibonacciLevels(prices, 233);
const fib13 = calculateFibonacciLevels(prices, 13);
const pivotPoints = [
  { level: fib13[0], type: 'поддержка' },
  { level: fib13[1], type: 'поддержка' },
  { level: fib13[2], type: 'поддержка' },
  { level: fib13[11], type: 'сопротивление' },
  { level: fib13[12], type: 'сопротивление' },
];
const reversalPoints = [
  { level: fib13[0], type: 'поддержка' },
  { level: fib13[1], type: 'поддержка' },
  { level: fib13[11], type: 'сопротивление' },
  { level: fib13[12], type: 'сопротивление' },
];
const rsi1h = calculateRSI(pricesClose, 14);
const rsi4h = calculateRSI(pricesClose, 56);
const rsi12h = calculateRSI(pricesClose, 168);
const rsi24h = calculateRSI(pricesClose, 336);
const overbought1h = rsi1h > 70;
const oversold1h = rsi1h < 30;
const overbought4h = rsi4h > 70;
const oversold4h = rsi4h < 30;
const overbought12h = rsi12h > 70;
const oversold12h = rsi12h < 30;
const overbought24h = rsi24h > 70;
const oversold24h = rsi24h < 30;
let recommendation = 'ожидание';

if (trend1h === 'восходящий' && currentPrice > fib13[0]) {
  recommendation = 'покупка';
} else if (trend1h === 'нисходящий' && currentPrice < fib13[0]) {
  recommendation = 'продажа';
} else if (trend1h === 'боковой' || (currentPrice > fib13[1] && currentPrice < fib13[0])) {
  recommendation = 'ожидание';
}

console.log(`Текущая цена: ${currentPrice.toFixed(2)}`);
console.log(`Изменение цены: ${priceChange.toFixed(2)} (${priceChangePercent.toFixed(2)}%)`);
//console.log(EMA21: ${ema21.toFixed(2)});
//console.log(EMA55: ${ema55.toFixed(2)});
//console.log(EMA89: ${ema89.toFixed(2)});
//console.log(EMA144: ${ema144.toFixed(2)});
//console.log(EMA233: ${ema233.toFixed(2)});
//console.log(SMA1h: ${sma1h.toFixed(2)} (${trend1h}));
//console.log(SMA4h: ${sma4h.toFixed(2)} (${trend4h}));
//console.log(SMA12h: ${sma12h.toFixed(2)} (${trend12h}));
//console.log(SMA24h: ${sma24h.toFixed(2)} (${trend24h}));
//console.log(Fibonacci 21: ${fib21.join(', ')});
//console.log(Fibonacci 55: ${fib55.join(', ')});
//console.log(Fibonacci 89: ${fib89.join(', ')});
//console.log(Fibonacci 144: ${fib144.join(', ')});
//console.log(Fibonacci 233: ${fib233.join(', ')});
console.log(`Pivot Points: ${pivotPoints.map(point => `${point.type} ${point.level}`).join(', ')}`);
console.log(`Reversal Points: ${reversalPoints.map(point => `${point.level}`).join(', ')}`);
console.log(`RSI1h: ${rsi1h.toFixed(2)} (${oversold1h ? 'oversold' : overbought1h ? 'overbought' : 'neutral'})`);
console.log(`RSI4h: ${rsi4h.toFixed(2)} (${oversold4h ? 'oversold' : overbought4h ? 'overbought' : 'neutral'})`);
console.log(`RSI12h: ${rsi12h.toFixed(2)} (${oversold12h ? 'oversold' : overbought12h ? 'overbought' : 'neutral'})`);
console.log(`RSI24h: ${rsi24h.toFixed(2)} (${oversold24h ? 'oversold' : overbought24h ? 'overbought' : 'neutral'})`);
