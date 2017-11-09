exports.regex = /[Rr]emind\s?(?:me)? (\d+) (.*)/;
exports.example = '/micah remindme <minutes> <msg>: repite <msg> en <minutes> minutos.';

exports.onMsg = function(bot, msg, match) {
  const chatId = msg.chat.id;
  var time = match[1].toLowerCase();
  var reminder = match[2].replace(/^\s+|\s+$/g, '');

  if (reminder === 'help' || reminder === 'undefined' || !reminder || !time) {
    bot.sendMessage(chatId, 'Tení que darme lo que querí que te recuerde y el tiempo! 🐣 (ej: /micah remindme 1 ya pasó 1 minuto)\n');
    return false;
  }

  setTimeout(()=>{
    bot.sendMessage(chatId, "⏲ "+reminder);
  }, parseInt(time)*1000*60);

  bot.sendMessage(chatId, "⏲ recordatorio guardado!");
};
