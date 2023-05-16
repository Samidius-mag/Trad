const { spawn } = require('child_process');

const loadPriceProcess = spawn('node', ['loadprice.js']);
const botProcess = spawn('node', ['bot.js']);

setInterval(() => {
  loadPriceProcess.kill();
  loadPriceProcess = spawn('node', ['loadprice.js']);
}, 5000);

setInterval(() => {
  botProcess.kill();
  botProcess = spawn('node', ['bot.js']);
}, 60000);
