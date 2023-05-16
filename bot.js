const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const chatId = 'YOUR_TELEGRAM_CHAT_ID';

const bot = new TelegramBot(token, { polling: false });

function sendMessage(message) {
  bot.sendMessage(chatId, message)
    .then(() => {
      console.log('отправлено');
    })
    .catch(error => {
      console.log(error);
    });
}

fs.readFile('price.json', (err, data) => {
  if (err) throw err;
  const prices = JSON.parse(data).map(candle => parseFloat(candle.close));
  const currentPrice = prices[prices.length - 1];
  const { supportLevels, resistanceLevels } = calculateLevels(prices);
  const trend = calculateTrend(prices);
  const activity = calculateActivity(prices);
  const message = `Текущая цена: ${currentPrice}\nУровни поддержки: ${supportLevels.join(', ')}\nУровни сопротивления: ${resistanceLevels.join(', ')}\nНаправление тренда: ${trend}\nАктивность на рынке: ${activity}%`;
  sendMessage(message);
});
