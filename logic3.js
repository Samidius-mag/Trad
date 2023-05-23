const fs = require('fs');
const { PSAR } = require('technicalindicators');

fs.readFile('price.json', (err, data) => {
  if (err) throw err;

  const prices = JSON.parse(data).map(candle => parseFloat(candle.close));
  const psar = PSAR.calculate({ high: prices, low: prices, step: 0.02, max: 0.2 });

  console.log(psar);
});
