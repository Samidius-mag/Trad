const fs = require('fs');
const { RSI, PSAR, EMA, SMA, MACD, ADX } = require('technicalindicators');

// Читаем данные из файла price.json
const rawData = fs.readFileSync('price.json');
const prices = JSON.parse(rawData);

// Разделяем массив цен на отдельные массивы для каждого временного интервала
const prices4h = prices.filter((price, index) => index % 4 === 0);
const prices12h = prices.filter((price, index) => index % 12 === 0);
const prices24h = prices.filter((price, index) => index % 24 === 0);

// Функция для расчета индикаторов
function calculateIndicators(prices, indicator, options) {
  const input = {
    open: prices.map(price => price.open),
    high: prices.map(price => price.high),
    low: prices.map(price => price.low),
    close: prices.map(price => price.close),
    volume: prices.map(price => price.volume),
    ...options
  };
  return indicator.calculate(input);
}

// Рассчитываем индикаторы для каждого временного интервала
const rsi4h = calculateIndicators(prices4h, RSI, { period: 14 });
const rsi12h = calculateIndicators(prices12h, RSI, { period: 14 });
const rsi24h = calculateIndicators(prices24h, RSI, { period: 14 });

const psar4h = calculateIndicators(prices4h, PSAR, { accelerationFactor: 0.02, maxAccelerationFactor: 0.2 });
const psar12h = calculateIndicators(prices12h, PSAR, { accelerationFactor: 0.02, maxAccelerationFactor: 0.2 });
const psar24h = calculateIndicators(prices24h, PSAR, { accelerationFactor: 0.02, maxAccelerationFactor: 0.2 });

const ema4h = calculateIndicators(prices4h, EMA, { period: 20 });
const ema12h = calculateIndicators(prices12h, EMA, { period: 20 });
const ema24h = calculateIndicators(prices24h, EMA, { period: 20 });

const sma4h = calculateIndicators(prices4h, SMA, { period: 50 });
const sma12h = calculateIndicators(prices12h, SMA, { period: 50 });
const sma24h = calculateIndicators(prices24h, SMA, { period: 50 });

const macd4h = calculateIndicators(prices4h, MACD, { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
const macd12h = calculateIndicators(prices12h, MACD, { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
const macd24h = calculateIndicators(prices24h, MACD, { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });

const adx4h = calculateIndicators(prices4h, ADX, { period: 14 });
const adx12h = calculateIndicators(prices12h, ADX, { period: 14 });
const adx24h = calculateIndicators(prices24h, ADX, { period: 14 });

// Определяем направление тренда для каждого временного интервала
const trend4h = ema4h[ema4h.length - 1] > sma4h[sma4h.length - 1] ? 'up' : 'down';
const trend12h = ema12h[ema12h.length - 1] > sma12h[sma12h.length - 1] ? 'up' : 'down';
const trend24h = ema24h[ema24h.length - 1] > sma24h[sma24h.length - 1] ? 'up' : 'down';

// Определяем точки входа и выхода для каждого временного интервала
const entry4h = rsi4h[rsi4h.length - 1] < 30 && psar4h[psar4h.length - 1] < prices4h[prices4h.length - 1].close ? 'buy' : 'sell';
const entry12h = rsi12h[rsi12h.length - 1] < 30 && psar12h[psar12h.length - 1] < prices12h[prices12h.length - 1].close ? 'buy' : 'sell';
const entry24h = rsi24h[rsi24h.length - 1] < 30 && psar24h[psar24h.length - 1] < prices24h[prices24h.length - 1].close ? 'buy' : 'sell';

const exit4h = rsi4h[rsi4h.length - 1] > 70 || psar4h[psar4h.length - 1] > prices4h[prices4h.length - 1].close ? 'sell' : 'hold';
const exit12h = rsi12h[rsi12h.length - 1] > 70 || psar12h[psar12h.length - 1] > prices12h[prices12h.length - 1].close ? 'sell' : 'hold';
const exit24h = rsi24h[rsi24h.length - 1] > 70 || psar24h[psar24h.length - 1] > prices24h[prices24h.length - 1].close ? 'sell' : 'hold';

// Определяем направление движения цены для каждого временного интервала
const direction4h = prices4h[prices4h.length - 1].close > prices4h[prices4h.length - 2].close ? 'up' : 'down';
const direction12h = prices12h[prices12h.length - 1].close > prices12h[prices12h.length - 2].close ? 'up' : 'down';
const direction24h = prices24h[prices24h.length - 1].close > prices24h[prices24h.length - 2].close ? 'up' : 'down';

// Выводим результаты в консоль
console.log(`4h trend: ${trend4h}, entry: ${entry4h}, exit: ${exit4h}, direction: ${direction4h}`);
console.log(`12h trend: ${trend12h}, entry: ${entry12h}, exit: ${exit12h}, direction: ${direction12h}`);
console.log(`24h trend: ${trend24h}, entry: ${entry24h}, exit: ${exit24h}, direction: ${direction24h}`);
