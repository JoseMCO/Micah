/* global require */
/* global process */
"use strict";

const TelegramBot = require('node-telegram-bot-api');
const requireDir = require('require-dir');
const config = require('./config');
const db = require('./utils/simple_db');
const scripts = requireDir('./scripts/');

db.load_db('./data/data.json', config);

const token = process.env.TELEGRAM_TOKEN || config.telegram.token;
const bot = new TelegramBot(token, {polling: true});

var commands = '🤖 Comandos: \n    - /micah commands: Muestra este mensaje.\n'; 
var regexs = '(a^)'; 
for (let i in scripts) {
  if (!scripts[i].regex) {console.log('El script '+i+' no tiene regex!'); continue;}
  if (!scripts[i].onMsg) {console.log('El script '+i+' no tiene onMsg!'); continue;}
  bot.onText(scripts[i].regex, scripts[i].onMsg.bind({config, db}, bot));
  if (scripts[i].example) {
    commands = commands + '    - '+scripts[i].example+'\n';
  }
  regexs = regexs + '|(' + scripts[i].regex.source + ')';
}
regexs = new RegExp(regexs);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  console.log("New user: "+user);
  if (msg.chat.type == 'private') {
    db.add_user(user);
    bot.sendMessage(chatId, "Wena, "+user.first_name+"!");
  }
});

bot.onText(/micah commands/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, commands);
});

bot.onText(/micah(.*)/, (msg) => {
  const chatId = msg.chat.id;
  if(!regexs.test(msg.text)) {
    bot.sendMessage(chatId, 'No te entiendo 🐒\n'+commands);
  }
});