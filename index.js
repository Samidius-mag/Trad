const { spawn } = require('child_process');

function runLoadPrice() {
  const loadPrice = spawn('node', ['loadprice.js']);
  loadPrice.stdout.on('data', (data) => {
    console.log(`loadprice.js: ${data}`);
  });
  loadPrice.stderr.on('data', (data) => {
    console.error(`loadprice.js error: ${data}`);
  });
}




function runLoadPrice() {
  const bot = spawn('node', ['bot.js']);
  bot.stdout.on('data', (data) => {
    console.log(`bot.js: ${data}`);
  });
  loadPrice.stderr.on('data', (data) => {
    console.error(`bot.js error: ${data}`);
  });
}

setInterval(() => {
  console.log('Restarting scripts...');
  runLoadPrice();
  runLogic();
}, 600000);

runLoadPrice();
runLogic();
