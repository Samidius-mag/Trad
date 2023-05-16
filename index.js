const loadprice = require('./loadprice');
const bot = require('./bot');

setInterval(() => {
  loadprice();
}, 5000);

setInterval(() => {
  bot();
}, 60000);
