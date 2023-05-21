const { SMA, RSI, BollingerBands, EMA } = require('technicalindicators');
const prices = require('./price.json');

// Логика для определения текущей цены
const currentPrice = prices[prices.length - 1].close;

// Логика для определения скорости изменения цены
const change = (currentPrice - prices[prices.length - 2].close) / prices[prices.length - 2].close;

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
const upper.toFixed(2) = ma.map((m, i) => m + sigmaDev[i]);
const lower..toFixed(2) = ma.map((m, i) => m - sigmaDev[i]);

// Сигнал на покупку
const basis = EMA.calculate({ period: bbPeriod, values: rsi });
const buySignal = basis[basis.length - 1] + ((upper[upper.length - 1] - lower[lower.length - 1]) * sigma);

// Сигнал на продажу
const sellSignal = basis[basis.length - 1] - ((upper[upper.length - 1] - lower[lower.length - 1]) * sigma);

console.log('Current price:', currentPrice);
console.log('RSI:', rsi[rsi.length - 1]);
console.log('Bollinger Bands:', bb[bb.length - 1]);
console.log('Upper band:', upper[upper.length - 1]);
console.log('Lower band:', lower[lower.length - 1]);
console.log('Buy signal:', buySignal.toFixed(2));
console.log('Sell signal:', sellSignal.toFixed(2));
