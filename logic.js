const fs = require('fs');
const { spawn } = require('child_process');

function calculateSupportResistance(prices) {
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const range = maxPrice - minPrice;
  const support1 = minPrice + range * 0.25;
  const support2 = minPrice + range * 0.5;
  const support3 = minPrice + range * 0.75;
  const resistance1 = maxPrice - range * 0.25;
  const resistance2 = maxPrice - range * 0.5;
  const resistance3 = maxPrice - range * 0.75;
  return {
    support1,
    support2,
    support3,
    resistance1,
    resistance2,
    resistance3,
  };
}

function calculateTrend(prices) {
  const currentPrice = prices[prices.length - 1];
  const prevPrice = prices[prices.length - 2];
  if (currentPrice > prevPrice) {
    return 'Up';
  } else if (currentPrice < prevPrice) {
    return 'Down';
  } else {
    return 'Flat';
  }
}

function runLogic() {
  fs.readFile('price.json', (err, data) => {
    if (err) throw err;
    const prices = JSON.parse(data);
    const levels = calculateSupportResistance(prices);
    const trend = calculateTrend(prices);
    console.log(`Support levels: ${levels.support1}, ${levels.support2}, ${levels.support3}`);
    console.log(`Resistance levels: ${levels.resistance1}, ${levels.resistance2}, ${levels.resistance3}`);
    console.log(`Trend: ${trend}`);
    setTimeout(() => {
      console.log('Restarting script...');
      const logic = spawn('node', ['logic.js']);
      logic.stdout.on('data', (data) => {
        console.log(`logic.js: ${data}`);
      });
      logic.stderr.on('data', (data) => {
        console.error(`logic.js error: ${data}`);
      });
    }, 120000);
  });
}

runLogic();
