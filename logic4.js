const fs = require('fs');
const { PSAR, RSI, EMA } = require('technicalindicators');

const data = JSON.parse(fs.readFileSync('price.json'));

const close = data.map(candle => candle.close);
const high = data.map(candle => candle.high);
const low = data.map(candle => candle.low);

// PSAR
const psarInput = {
  high,
  low,
  accelerationFactor: 0.02,
  maxAccelerationFactor: 0.2,
};
const psar = PSAR.calculate(psarInput);

// RSI
const rsiInput = {
  values: close,
  period: 14,
};
const rsi = RSI.calculate(rsiInput);

// EMA
const ema21 = EMA.calculate({ period: 21, values: close });
const ema55 = EMA.calculate({ period: 55, values: close });
const ema89 = EMA.calculate({ period: 89, values: close });
const ema144 = EMA.calculate({ period: 144, values: close });

// Точки входа и выхода
const buySignals = [];
const sellSignals = [];

for (let i = 1; i < data.length; i++) {
  const prevPsar = psar[i - 1];
  const currPsar = psar[i];
  const prevRsi = rsi[i - 1];
  const currRsi = rsi[i];
  const prevEma21 = ema21[i - 1];
  const currEma21 = ema21[i];
  const prevEma55 = ema55[i - 1];
  const currEma55 = ema55[i];
  const prevEma89 = ema89[i - 1];
  const currEma89 = ema89[i];
  const prevEma144 = ema144[i - 1];
  const currEma144 = ema144[i];

  // Точки входа
  if (
    prevPsar > prevEma21 &&
    currPsar < currEma21 &&
    prevRsi < 30 &&
    currRsi > 30 &&
    prevEma21 < prevEma55 &&
    currEma21 > currEma55 &&
    prevEma55 < prevEma89 &&
    currEma55 > currEma89 &&
    prevEma89 < prevEma144 &&
    currEma89 > currEma144
  ) {
    buySignals.push({
      time: data[i].time,
      price: data[i].close,
    });
  }

  // Точки выхода
  if (
    prevPsar < prevEma21 &&
    currPsar > currEma21 &&
    prevRsi > 70 &&
    currRsi < 70 &&
    prevEma21 > prevEma55 &&
    currEma21 < currEma55 &&
    prevEma55 > prevEma89 &&
    currEma55 < currEma89 &&
    prevEma89 > prevEma144 &&
    currEma89 < currEma144
  ) {
    sellSignals.push({
      time: data[i].time,
      price: data[i].close,
    });
  }
}

console.log('Buy signals:', buySignals);
console.log('Sell signals:', sellSignals);

// Определение направления тренда
const trendDirection = ema21[ema21.length - 1] > ema55[ema55.length - 1] ? 'up' : 'down';
console.log('Trend direction:', trendDirection);

// Уровни отскоков
const support1 = ema55[ema55.length - 1];
const support2 = ema89[ema89.length - 1];
const resistance1 = ema21[ema21.length - 1];
const resistance2 = ema144[ema144.length - 1];
console.log('Support 1:', support1);
console.log('Support 2:', support2);
console.log('Resistance 1:', resistance1);
console.log('Resistance 2:', resistance2);

// Точки разворота
const reversalPoints = [];
for (let i = 1; i < data.length; i++) {
  const prevEma21 = ema21[i - 1];
  const currEma21 = ema21[i];
  const prevEma55 = ema55[i - 1];
  const currEma55 = ema55[i];
  const prevEma89 = ema89[i - 1];
  const currEma89 = ema89[i];
  const prevEma144 = ema144[i - 1];
  const currEma144 = ema144[i];

  if (
    prevEma21 < prevEma55 &&
    currEma21 > currEma55 &&
    prevEma55 < prevEma89 &&
    currEma55 > currEma89 &&
    prevEma89 < prevEma144 &&
    currEma89 > currEma144
  ) {
    reversalPoints.push({
      time: data[i].time,
      price: data[i].close,
    });
  }

  if (
    prevEma21 > prevEma55 &&
    currEma21 < currEma55 &&
    prevEma55 > prevEma89 &&
    currEma55 < currEma89 &&
    prevEma89 > prevEma144 &&
    currEma89 < currEma144
  ) {
    reversalPoints.push({
      time: data[i].time,
      price: data[i].close,
    });
  }
}

console.log('Reversal points:', reversalPoints);
