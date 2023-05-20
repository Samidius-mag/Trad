const fs = require('fs');
const { SMA, RSI, MACD, EMA } = require('technicalindicators');
const price = JSON.parse(fs.readFileSync('price.json'));

// Рассчитываем SMA (Simple Moving Average) с разными периодами
const smaPeriods = [21, 55, 89, 144];
const smaValues = smaPeriods.map(period => SMA.calculate({ period, values: price.map(p => Number(p.close)) }));
const smaCurrentValues = smaValues.map(sma => sma[sma.length - 1]);

// Рассчитываем RSI (Relative Strength Index) с разными периодами
const rsiPeriods = [14, 28, 56, 84];
const rsiValues = rsiPeriods.map(period => RSI.calculate({ period, values: price.map(p => Number(p.close)) }));
const rsiCurrentValues = rsiValues.map(rsi => rsi[rsi.length - 1]);

// Рассчитываем MACD (Moving Average Convergence Divergence) с разными параметрами
const macdInputs = [
  { values: price.map(p => Number(p.close)), fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  { values: price.map(p => Number(p.close)), fastPeriod: 6, slowPeriod: 13, signalPeriod: 4 },
  { values: price.map(p => Number(p.close)), fastPeriod: 28, slowPeriod: 56, signalPeriod: 14 },
  { values: price.map(p => Number(p.close)), fastPeriod: 42, slowPeriod: 84, signalPeriod: 21 },
];
const macdValues = macdInputs.map(input => MACD.calculate(input));
const macdCurrentValues = macdValues.map(macd => macd[macd.length - 1]);
const macdSignalValues = macdValues.map(macd => macd[macd.length - 1].signal);

// Рассчитываем EMA (Exponential Moving Average) с периодом 50
const emaPeriod = 50;
const emaValues = EMA.calculate({ period: emaPeriod, values: price.map(p => Number(p.close)) });
const emaCurrentValue = emaValues[emaValues.length - 1];

// Рассчитываем прогноз цен на 12, 4 и 1 час и направление тренда
const lastPrice = price[price.length - 1].close;
const predictions = [];
const trends = [];
for (let i = 0; i < smaPeriods.length; i++) {
  const sma = smaCurrentValues[i];
  const rsi = rsiCurrentValues[i];
  const macdValue = macdCurrentValues[i].MACD;
  const signalValue = macdSignalValues[i];
  const prediction12h = lastPrice * (1 + ((sma - lastPrice) / lastPrice) + ((rsi - 50) / 100 * 2) + ((macdValue - signalValue) / lastPrice * 2));
  predictions.push(prediction12h);
  const trend12h = prediction12h > emaCurrentValue ? 'Вверх' : 'Вниз';
  trends.push(trend12h);
}
for (let i = 0; i < smaPeriods.length; i++) {
  const sma = smaValues[i][smaValues[i].length - 4];
  const rsi = rsiValues[i][rsiValues[i].length - 4];
  const macdValue = macdValues[i][macdValues[i].length - 4].MACD;
  const signalValue = macdValues[i][macdValues[i].length - 4].signal;
  const prediction4h = price[price.length - 4].close * (1 + ((sma - price[price.length - 4].close) / price[price.length - 4].close) + ((rsi - 50) / 100) + ((macdValue - signalValue) / price[price.length - 4].close));
  predictions.push(prediction4h);
  const trend4h = prediction4h > emaCurrentValue ? 'Вверх' : 'Вниз';
  trends.push(trend4h);
}
for (let i = 0; i < smaPeriods.length; i++) {
  const sma = smaValues[i][smaValues[i].length - 1];
  const rsi = rsiValues[i][rsiValues[i].length - 1];
  const macdValue = macdValues[i][macdValues[i].length - 1].MACD;
  const signalValue = macdValues[i][macdValues[i].length - 1].signal;
  const prediction1h = price[price.length - 1].close * (1 + ((sma - price[price.length - 1].close) / price[price.length - 1].close) + ((rsi - 50) / 100) + ((macdValue - signalValue) / price[price.length - 1].close));
  predictions.push(prediction1h);
  const trend1h = prediction1h > emaCurrentValue ? 'Вверх' : 'Вниз';
  trends.push(trend1h);
}

console.log(`Прогноз 1H: ${predictions.slice(smaPeriods.length * 2).map(p => p.toFixed(2)).join(', ')}`);
console.log(`Тренд 1H: ${trends.slice(smaPeriods.length * 2).join(', ')}`);
console.log(`Прогноз 4H: ${predictions.slice(smaPeriods.length, smaPeriods.length * 2).map(p => p.toFixed(2)).join(', ')}`);
console.log(`Тренд 4H: ${trends.slice(smaPeriods.length, smaPeriods.length * 2).join(', ')}`);
console.log(`Прогноз 12H: ${predictions.slice(0, smaPeriods.length).map(p => p.toFixed(2)).join(', ')}`);
console.log(`Тренд 12H: ${trends.slice(0, smaPeriods.length).join(', ')}`);
