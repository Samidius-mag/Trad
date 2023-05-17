const fs = require('fs');
const { ROC, RVI } = require('technicalindicators');

const data = JSON.parse(fs.readFileSync('price.json'));

const rocInput = {
  values: data.map(candle => candle.close),
  period: 14
};

const rviInput = {
  values: data.map(candle => ({
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close
  })),
  period: 14
};

const roc = ROC.calculate(rocInput);
const rvi = RVI.calculate(rviInput);

const lastCandle = data[data.length - 1];
const currentPrice = lastCandle.close;

const monthlyTrend = roc[roc.length - 30] > 0 ? 'Восходящий' : 'Нисходящий';
const dailyTrend = roc[roc.length - 1] > 0 ? 'Восходящий' : 'Нисходящий';
const currentTrend = roc[roc.length - 1] > roc[roc.length - 2] ? 'Восходящий' : 'Нисходящий';

let trend;
if (Math.abs(roc[roc.length - 1]) < 1 && rvi[rvi.length - 1] >= 45 && rvi[rvi.length - 1] <= 55) {
  trend = 'Боковой';
} else {
  trend = currentTrend;
}

const supportLevels = data.slice(-30).reduce((levels, candle) => {
  if (candle.low < levels.support1 || !levels.support1) {
    levels.support2 = levels.support1;
    levels.support1 = candle.low;
  } else if (candle.low < levels.support2 || !levels.support2) {
    levels.support2 = candle.low;
  }
  return levels;
}, { support1: null, support2: null });

const resistanceLevels = data.slice(-30).reduce((levels, candle) => {
  if (candle.high > levels.resistance1 || !levels.resistance1) {
    levels.resistance2 = levels.resistance1;
    levels.resistance1 = candle.high;
  } else if (candle.high > levels.resistance2 || !levels.resistance2) {
    levels.resistance2 = candle.high;
  }
  return levels;
}, { resistance1: null, resistance2: null });

const speed = roc[roc.length - 1];
const volatility = rvi[rvi.length - 1];

console.log('Текущая цена:', currentPrice);
console.log('Месячный тренд:', monthlyTrend);
console.log('Дневной тренд:', dailyTrend);
console.log('Текущий тренд:', currentTrend);
console.log('Уровни поддержки:', supportLevels);
console.log('Уровни сопротивления:', resistanceLevels);
console.log('Скорость движения рынка:', speed);
console.log('Волатильность:', volatility);
