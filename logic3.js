const fs = require('fs');

const data = JSON.parse(fs.readFileSync('price.json'));

const close = data.map(candle => parseFloat(candle.close));

//console.log(close); // выводим значения цены закрытия в консоль

//TODO: Need to change offsets so pivot is drawn ahead of last bar. The offset
// changes depending on the current time frame being displayed.
let fourHR_offset = 1;
let day_offset = 2;
let week_offset = 3;
let month_offset = 4;

// функция для расчета уровней Pivot
function calculatePivot(close, high, low, offset) {
  const pivot = (high + low + close) / 3;
  const resistance1 = 2 * pivot - low;
  const support1 = 2 * pivot - high;
  const resistance2 = pivot + (high - low);
  const support2 = pivot - (high - low);
  const resistance3 = high + 2 * (pivot - low);
  const support3 = low - 2 * (high - pivot);
  return {
    pivot: pivot.toFixed(2),
    resistance1: resistance1.toFixed(2),
    support1: support1.toFixed(2),
    resistance2: resistance2.toFixed(2),
    support2: support2.toFixed(2),
    resistance3: resistance3.toFixed(2),
    support3: support3.toFixed(2),
    offset: offset
  };
}

// расчет уровней Pivot для периодов 4 часа, 1 день, 1 неделя и 1 месяц
const pivot4h = calculatePivot(close.slice(-4), Math.max(...data.slice(-4).map(candle => parseFloat(candle.high))), Math.min(...data.slice(-4).map(candle => parseFloat(candle.low))), fourHR_offset);
const pivot1d = calculatePivot(close.slice(-24), Math.max(...data.slice(-24).map(candle => parseFloat(candle.high))), Math.min(...data.slice(-24).map(candle => parseFloat(candle.low))), day_offset);
const pivot1w = calculatePivot(close.slice(-168), Math.max(...data.slice(-168).map(candle => parseFloat(candle.high))), Math.min(...data.slice(-168).map(candle => parseFloat(candle.low))), week_offset);
const pivot1m = calculatePivot(close.slice(-720), Math.max(...data.slice(-720).map(candle => parseFloat(candle.high))), Math.min(...data.slice(-720).map(candle => parseFloat(candle.low))), month_offset);

console.log(`4h pivot: ${pivot4h.pivot}, R1: ${pivot4h.resistance1}, S1: ${pivot4h.support1}, R2: ${pivot4h.resistance2}, S2: ${pivot4h.support2}, R3: ${pivot4h.resistance3}, S3: ${pivot4h.support3}, offset: ${pivot4h.offset}`);
console.log(`1d pivot: ${pivot1d.pivot}, R1: ${pivot1d.resistance1}, S1: ${pivot1d.support1}, R2: ${pivot1d.resistance2}, S2: ${pivot1d.support2}, R3: ${pivot1d.resistance3}, S3: ${pivot1d.support3}, offset: ${pivot1d.offset}`);
console.log(`1w pivot: ${pivot1w.pivot}, R1: ${pivot1w.resistance1}, S1: ${pivot1w.support1}, R2: ${pivot1w.resistance2}, S2: ${pivot1w.support2}, R3: ${pivot1w.resistance3}, S3: ${pivot1w.support3}, offset: ${pivot1w.offset}`);
console.log(`1m pivot: ${pivot1m.pivot}, R1: ${pivot1m.resistance1}, S1: ${pivot1m.support1}, R2: ${pivot1m.resistance2}, S2: ${pivot1m.support2}, R3: ${pivot1m.resistance3}, S3: ${pivot1m.support3}, offset: ${pivot1m.offset}`);
