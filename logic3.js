const ta = require('ta-lib');
const prices = require('./price.json');

// Логика для определения текущей цены
const currentPrice = prices[prices.length - 1].close;

// Логика для определения скорости изменения цены
const change = (currentPrice - prices[prices.length - 2].close) / prices[prices.length - 2].close;

// Логика для построения RSI с периодом 14
const rsiPeriod = 14;
const rsi = ta.RSI(prices.map(price => price.close), rsiPeriod);

// Логика для построения MA внутри BB с периодом 20
const bbPeriod = 20;
const bb = ta.BBANDS(prices.map(price => price.close), bbPeriod);

// Логика для построения Дисперсии вокруг MA (sigma) = 0.01
const sigma = 0.01;
const ma = ta.SMA(prices.map(price => price.close), bbPeriod);
const stdev = ta.STDDEV(prices.map(price => price.close), bbPeriod);
const dev = bb.outRealUpperBand.map((upper, i) => upper - bb.outRealLowerBand[i]);
const forMult = 2;
const sigmaDev = dev.map(d => d * sigma);
const upper = ma.map((m, i) => m + sigmaDev[i]);
const lower = ma.map((m, i) => m - sigmaDev[i]);

// Сигнал на покупку
const basis = ta.EMA(rsi, bbPeriod);
const buySignal = basis[basis.length - 1] + ((upper[upper.length - 1] - lower[lower.length - 1]) * sigma);

// Сигнал на продажу
const sellSignal = basis[basis.length - 1] - ((upper[upper.length - 1] - lower[lower.length - 1]) * sigma);

console.log('Current price:', currentPrice);
console.log('Price change:', change);
console.log('RSI:', rsi[rsi.length - 1]);
console.log('Bollinger Bands:', bb);
console.log('MA:', ma[ma.length - 1]);
console.log('Standard deviation:', stdev[stdev.length - 1]);
console.log('Upper band:', upper[upper.length - 1]);
console.log('Lower band:', lower[lower.length - 1]);
console.log('Buy signal:', buySignal);
console.log('Sell signal:', sellSignal);
