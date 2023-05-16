const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const chatId = 'YOUR_TELEGRAM_CHAT_ID';

const bot = new TelegramBot(token, { polling: false });

function sendTelegramMessage(message) {
  bot.sendMessage(chatId, message)
    .then(() => {
      console.log('Message sent to Telegram');
    })
    .catch((error) => {
      console.log(error);
    });
}

fs.readFile('price.json', (err, data) => {
  if (err) throw err;
  const prices = JSON.parse(data);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const currentPrice = prices[prices.length - 1];
  const range = maxPrice - minPrice;
  const support = minPrice + range * 0.25;
  const resistance = maxPrice - range * 0.25;
  const trend = currentPrice > prices[prices.length - 2] ? 'up' : 'down';
  const message = `Текущая цена: ${currentPrice.toFixed(2)}\Поддержка : ${support.toFixed(2)}\nСопротивление: ${resistance.toFixed(2)}\nТренд: ${trend}`;
  sendTelegramMessage(message);
});
