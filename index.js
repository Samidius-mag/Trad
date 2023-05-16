const { spawn } = require('child_process');

const loadPriceInterval = 5000; // 5 секунд
const botInterval = 60000; // 1 минута

// Запускаем скрипт loadprice.js с интервалом loadPriceInterval
setInterval(() => {
  const childLoadPrice = spawn('node', ['loadprice.js']);

  childLoadPrice.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  childLoadPrice.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  childLoadPrice.on('close', code => {
    console.log(`loadprice.js exited with code ${code}`);
  });
}, loadPriceInterval);

// Запускаем скрипт bot.js с интервалом botInterval
setInterval(() => {
  const childBot = spawn('node', ['bot.js']);

  childBot.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  childBot.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  childBot.on('close', code => {
    console.log(`bot.js exited with code ${code}`);
  });
}, botInterval);
