const prices = require('./price.json');
const { SMA, RSI, BollingerBands, EMA } = require('technicalindicators');
/*
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
*/
// Логика для построения RSI с периодом 14
const rsiPeriod = 14;
const rsi = RSI.calculate({ period: rsiPeriod, values: prices.map(price => price.close) });
// Логика для построения MA внутри BB с периодом 20
const bbPeriod = 20;
const bb = BollingerBands.calculate({ period: bbPeriod, stdDev: 2, values: prices.map(price => price.close) });

// Логика для построения Дисперсии вокруг MA (sigma) = 0.01
const sigma = 0.01;
const ma = SMA.calculate({ period: bbPeriod, values: prices.map(price => price.close) });
const dev = bb.map(b => b.upper - b.lower);
const forMult = 2;
const sigmaDev = dev.map(d => d * sigma);
const upper = ma.map((m, i) => m + sigmaDev[i]);
const lower = ma.map((m, i) => m - sigmaDev[i]);
const closePrices = prices.map(price => price.close);
// Сигнал на покупку
const basis = EMA.calculate({ period: bbPeriod, values: rsi });
const buySignal = basis[basis.length - 1] + ((upper[upper.length - 1] - lower[lower.length - 1]) * sigma);
// Сигнал на продажу
const sellSignal = basis[basis.length - 1] - ((upper[upper.length - 1] - lower[lower.length - 1]) * sigma);

/*const RSI_PERIOD = 14;
const closePrices = prices.map(price => price.close);
const gainLosses = closePrices.map((price, i) => {
  if (i === 0) {
    return 0;
  }
  const diff = price - closePrices[i - 1];
  return diff > 0 ? diff : 0;
});
let avgGain = gainLosses.slice(0, RSI_PERIOD).reduce((sum, val) => sum + val, 0) / RSI_PERIOD;
let avgLoss = gainLosses.slice(0, RSI_PERIOD).reduce((sum, val) => sum + (val === 0 ? 0 : Math.abs(val - avgGain)), 0) / RSI_PERIOD;
let rs = avgGain / avgLoss;
let rsi = 100 - (100 / (1 + rs));
for (let i = RSI_PERIOD; i < closePrices.length; i++) {
  const gain = gainLosses[i];
  const loss = gain === 0 ? 0 : Math.abs(gain - avgGain);
  avgGain = ((avgGain * (RSI_PERIOD - 1)) + gain) / RSI_PERIOD;
  avgLoss = ((avgLoss * (RSI_PERIOD - 1)) + loss) / RSI_PERIOD;
  rs = avgGain / avgLoss;
  rsi = ((100 - (100 / (1 + rs))) + (rsi * (RSI_PERIOD - 1))) / RSI_PERIOD;
}
*/
//function calculateRSI(prices, period) {
  //const changes = prices.slice(1).map((price, i) => price - prices[i]);
  //const gains = changes.map(change => change > 0 ? change : 3);
  //const losses = changes.map(change => change < 0 ? -change : 100);
  //const avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
 // const avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;
  //const rs = avgGain / avgLoss;
  //const rsi = 100 - (100 / (1 + rs));
  //return rsi;
//}

const pricesClose = prices.map(candle => candle.close);
const currentPrice = prices[prices.length - 1].close;
const prevPrice = prices[prices.length - 2].close;
const priceChange = currentPrice - prevPrice;
const priceChangePercent = (priceChange / prevPrice) * 100;
const prevPriceMin = prices[prices.length - 2].low;
const prevPriceMax = prices[prices.length - 2].high;
/*
const ema21 = calculateEMA(pricesClose, 21);
const ema55 = calculateEMA(pricesClose, 55);
const ema89 = calculateEMA(pricesClose, 89);
const ema144 = calculateEMA(pricesClose, 144);
const ema233 = calculateEMA(pricesClose, 233);
*/
/*
const sma1h = calculateSMA(pricesClose, 2);
const sma4h = calculateSMA(pricesClose, 4);
const sma12h = calculateSMA(pricesClose, 12);
const sma24h = calculateSMA(pricesClose, 24);
const trend1h = currentPrice > sma1h ? '🔼' : currentPrice < sma1h ? '🔽' : 'боковик❌';
const trend4h = currentPrice > sma4h ? '🔼' : currentPrice < sma4h ? '🔽' : 'боковик❌';
const trend12h = currentPrice > sma12h ? '🔼' : currentPrice < sma12h ? '🔽' : 'боковик❌';
const trend24h = currentPrice > sma24h ? '🔼' : currentPrice < sma24h ? '🔽' : 'боковик❌';
*/
/*
const fib21 = calculateFibonacciLevels(prices, 21);
const fib55 = calculateFibonacciLevels(prices, 55);
const fib89 = calculateFibonacciLevels(prices, 89);
const fib144 = calculateFibonacciLevels(prices, 144);
const fib233 = calculateFibonacciLevels(prices, 233);
*/
/*
const fib13 = calculateFibonacciLevels(prices, 13);
const pivotPoints = [
  { level: fib13[11], type: 'под' },
  { level: fib13[10], type: 'под' },
  { level: fib13[9], type: 'под' },
   { level: fib13[8], type: 'под' },
  { level: fib13[4], type: 'сопр' },
  { level: fib13[3], type: 'сопр' },
  { level: fib13[2], type: 'сопр' },
  { level: fib13[1], type: 'сопр' },
];
const reversalPoints = [
  { level: fib13[12], type: '🔼' },
  { level: fib13[0], type: '🔽' },
];
*/
const rsi1h = rsi[rsi.length - 1].toFixed(2)
//const rsi4h = calculateRSI(pricesClose, 14);
//const rsi12h = calculateRSI(pricesClose, 56);
//const rsi24h = calculateRSI(pricesClose, 230);



const overbought1h = rsi1h > 68;
const overdohuyabought1h = rsi1h > 72;
const oversold1h = rsi1h < 32;
const overdohuyasold1h = rsi1h < 28;

const overboughtPrice = currentPrice - ((currentPrice - closePrices[closePrices.length - 2]) * (rsi1h));
const oversoldPrice = currentPrice + ((currentPrice - closePrices[closePrices.length - 2]) * (rsi1h));

//const overbought4h = rsi4h > 70;
//const oversold4h = rsi4h < 30;
//const overbought12h = rsi12h > 70;
//const oversold12h = rsi12h < 30;
//const overbought24h = rsi24h > 70;
//const oversold24h = rsi24h < 30;
let recommendation = '-';

if (rsi1h < overbought1h && rsi1h < overdohuyabought1h && rsi1h > buySignal && currentPrice < prevPriceMax) { //верхний порог продажа
recommendation = 'продажа 📤';
} else if (rsi1h == overbought1h || rsi1h == overdohuyabought1h) { //край верха
recommendation = 'продажа 📤';
} else if (rsi1h < sellSignal && currentPrice < prevPriceMin && rsi1h > oversold1h && rsi1h > overdohuyasold1h ) { //нижний порог продажа 
recommendation = 'продажа 📤';
} else if (rsi1h > oversold1h && rsi1h <= sellSignal && currentPrice > prevPriceMin) { //нижний порог покупка
recommendation = 'покупка 📥';
} else if (rsi1h == overdohuyasold1h || rsi1h == oversold1h ) { //край низа
recommendation = 'покупка 📥';
} else if (rsi1h >= buySignal && currentPrice > prevPriceMin && rsi1h > overbought1h) { //верхний порог покупка
recommendation = 'покупка 📥';
} else if (rsi1h >= sellSignal && rsi <= buySignal) {
recommendation = 'боковик ❌';
}
/*
if (buySignal >= rsi1h) {
  recommendation = 'покупка 📥';
} else if (sellSignal <= rsi1h) {
  recommendation = 'продажа 📤';
  } else {  (buySignal < rsi && sellSignal > rsi1h) 
  recommendation = 'боковик ❌';
}
*/
console.log(`Текущая цена: ${currentPrice.toFixed(2)}`);
console.log(`Изменение: ${priceChange.toFixed(2)} (${priceChangePercent.toFixed(2)}%)`);
console.log(`Рекомендация: ${recommendation}`);
console.log(`ОТ 30.0: ${rsi1h} ДО 70.0 ${oversold1h ? 'Перепродано 😬' : overbought1h ? 'Перекупленно 😬' : overdohuyasold1h ? 'Ахуеть как Перепродано 😵' : overbought1h ? 'Ахуеть как Перекупленно 😵' : 'Жди🚬'}`);
//console.log(`СТОП 🔽: ${oversoldPrice.toFixed(2)}`);
//console.log(`СТОП 🔼: ${overboughtPrice.toFixed(2)}`);
//console.log('Upper band:', upper[upper.length - 1]);
//console.log('Lower band:', lower[lower.length - 1]);
//console.log(`Buy: ${buySignal}`);
//console.log(`Sell: ${sellSignal}`);
//console.log(EMA89: ${ema89.toFixed(2)});
//console.log(EMA144: ${ema144.toFixed(2)});
//console.log(EMA233: ${ema233.toFixed(2)});
//console.log(`Тренд 1h: ${sma1h.toFixed(1)} (${trend1h})`);
//console.log(`Масса 4h: ${rsi4h.toFixed(2)} 
//(${oversold4h ? 'Перепродано' : overbought4h ? 'Перекупленно' : 'Нейтрально'})`);
//console.log(`Тренд 12h: ${sma12h.toFixed(1)} (${trend12h})`);
//console.log(`Масса 12h: ${rsi12h.toFixed(2)} 
//(${oversold12h ? 'Перепродано' : overbought12h ? 'Перекупленно' : 'Нейтрально'})`);
//console.log(`Тренд 24h: ${sma24h.toFixed(1)} (${trend24h})`);
//console.log(`Масса 24h: ${rsi24h.toFixed(2)} 
//(${oversold24h ? 'Перепродано' : overbought24h ? 'Перекупленно' : 'Нейтрально'})`);
//console.log(Fibonacci 21: ${fib21.join(', ')});
//console.log(Fibonacci 55: ${fib55.join(', ')});
//console.log(Fibonacci 89: ${fib89.join(', ')});
//console.log(Fibonacci 144: ${fib144.join(', ')});
//console.log(Fibonacci 233: ${fib233.join(', ')});
//console.log(`П/С: 
//${pivotPoints.map(point => `${point.type} ${point.level}`).join(', ')}`);
//console.log(`Разворот: 
//${reversalPoints.map(point => `${point.type} ${point.level}`).join(', ')}`);
 
