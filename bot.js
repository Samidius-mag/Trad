const TelegramBot = require('node-telegram-bot-api');
const { calculateLevels, calculateTrend, calculateActivity } = require('./logic');
const fs = require('fs');

const token = '5995075949:AAHek1EL2dqZvJlIR3ssuFLkIsb3ZTgccIQ';
const chatId = '-943696838';

const bot = new TelegramBot(token, { polling: false });

function sendMessage(message) {
  bot.sendMessage(chatId, message)
    .then(() => {
      console.log('Отправлено');
    })
    .catch(error => {
      console.log(error);
    });
}

fs.readFile('price.json', (err, data) => {
  if (err) throw err;

  const prices = JSON.parse(data).map(candle => parseFloat(candle.close));

  const levels = calculateLevels(prices);
  const trend = calculateTrend(prices);
  const activity = calculateActivity(prices);

  const message = `
    Текущая цена: ${levels.currentPrice}
    Уровни поддержки: ${levels.supportLevels}
    Уровни сопротивления: ${levels.resistanceLevels}
    Направление тренда: ${trend}
    Активность на рынке: ${activity}%
  `;

  sendMessage(message);
});
