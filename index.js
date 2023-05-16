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

function runLogic() {
  const logic = spawn('node', ['logic.js']);
  logic.stdout.on('data', (data) => {
    console.log(`logic.js: ${data}`);
  });
  logic.stderr.on('data', (data) => {
    console.error(`logic.js error: ${data}`);
  });
}

setInterval(() => {
  console.log('Restarting scripts...');
  runLoadPrice();
  runLogic();
}, 600000);

runLoadPrice();
runLogic();
