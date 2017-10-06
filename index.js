/* global require */
/* global process */
"use strict";

const TelegramBot = require('node-telegram-bot-api');
const requireDir = require('require-dir');
const config = require('./config');
const db = require('./utils/simple_db');
const scripts = requireDir('./scripts/');

db.read_db('./data.json', config);

const token = process.env.TELEGRAM_TOKEN || config.telegram.token;
const bot = new TelegramBot(token, {polling: true});

var commands = '🤖 Comandos: \n    - micah commands: Muestra este mensaje.\n'; 
for (let i in scripts) {
  bot.onText(scripts[i].regex, scripts[i].onMsg.bind({config, db}, bot));
  if (scripts[i].example) {
    commands = commands += '    - '+scripts[i].example+'\n';
  }
}

bot.onText(/micah commands/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, commands);
});



// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   console.log(msg)
//   // send a message to the chat acknowledging receipt of their message
//   // bot.sendMessage(chatId, 'Received your message');
// });