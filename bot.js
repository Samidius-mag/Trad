const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Задаем токен бота, полученный от BotFather
const token = '5995075949:AAHek1EL2dqZvJlIR3ssuFLkIsb3ZTgccIQ';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: false });

// Задаем ID чата, в который будем отправлять сообщения
const chatId = '-943696838';

// Функция для отправки сообщения в чат
function sendMessage(message) {
  bot.sendMessage(chatId, message);
}

// Функция для чтения данных из файла logic.js и отправки сообщения в чат
function sendLogicData() {
  fs.readFile('logic.js', (err, data) => {
    if (err) throw err;
    const message = data.toString();
    sendMessage(message);
  });
}

// Отправляем сообщение сразу после запуска бота
sendLogicData();

// Отправляем сообщение каждые 5 минут
setInterval(sendLogicData, 300000);
