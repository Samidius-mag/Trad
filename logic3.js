const fs = require('fs');
const ta = require('technicalindicators');

// Загрузка данных из файла price.json
const rawData = fs.readFileSync('price.json');
const prices = JSON.parse(rawData);

// Настройка параметров индикаторов
const rsiPeriod = 14;
const psarAcceleration = 0.02;
const psarMaxAcceleration = 0.2;
const emaPeriod = 20;
const smaPeriod = 50;
const macdFastPeriod = 12;
const macdSlowPeriod = 26;
const macdSignalPeriod = 9;

// Вычисление индикаторов
const rsi = ta.RSI.calculate({ period: rsiPeriod, values: prices.map(p => p.close) });
const psar = ta.PSAR.calculate({ acceleration: psarAcceleration, maxAcceleration: psarMaxAcceleration, high: prices.map(p => p.high), low: prices.map(p => p.low) });
const ema = ta.EMA.calculate({ period: emaPeriod, values: prices.map(p => p.close) });
const sma = ta.SMA.calculate({ period: smaPeriod, values: prices.map(p => p.close) });
const macd = ta.MACD.calculate({ fastPeriod: macdFastPeriod, slowPeriod: macdSlowPeriod, signalPeriod: macdSignalPeriod, values: prices.map(p => p.close) });

// Логика торговой стратегии
const currentPrice = prices[prices.length - 1].close;
const lastPrice = prices[prices.length - 2].close;
const trend = currentPrice > lastPrice ? 'up' : 'down';
const rsiDirection = rsi[rsi.length - 1] > 50 ? 'up' : 'down';
const psarDirection = psar[psar.length - 1].trend === 'up' ? 'up' : 'down';
const emaDirection = currentPrice > ema[ema.length - 1] ? 'up' : 'down';
const smaDirection = currentPrice > sma[sma.length - 1] ? 'up' : 'down';
const macdDirection = macd[macd.length - 1].histogram > 0 ? 'up' : 'down';

// Вывод результатов
console.log(`Current price: ${currentPrice}`);
console.log(`Trend: ${trend}`);
console.log(`RSI direction: ${rsiDirection}`);
console.log(`PSAR direction: ${psarDirection}`);
console.log(`EMA direction: ${emaDirection}`);
console.log(`SMA direction: ${smaDirection}`);
console.log(`MACD direction: ${macdDirection}`);
