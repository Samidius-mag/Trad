const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = '5995075949:AAHek1EL2dqZvJlIR3ssuFLkIsb3ZTgccIQ';
const chatId = '-943696838';

const bot = new TelegramBot(token, { polling: false });

function sendToTelegram(message) {
  bot.sendMessage(chatId, message);
}

function analyzePrice() {
  const prices = JSON.parse(fs.readFileSync('price.json'));
  const trend = calculateTrend(prices);
  const levels = calculateLevels(prices);
  const message = `Тренд: ${trend}\nУровни поддержки: ${levels.support}\nУровни сопротивления: ${levels.resistance}`;
  sendToTelegram(message);
}

analyzePrice();
