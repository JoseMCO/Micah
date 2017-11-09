exports.regex = /[Rr]emaind\s?(?:me)? (\d+) (.*)/;
exports.example = '/micah remaindme <minutes> <msg>: repite <msg> en <minutes> minutos.';

exports.onMsg = function(bot, msg, match) {
  const chatId = msg.chat.id;
  var time = match[1].toLowerCase();
  var remainder = match[2].replace(/^\s+|\s+$/g, '');

  if (remainder === 'help' || remainder === 'undefined' || !remainder || !time) {
    bot.sendMessage(chatId, 'Tení que darme lo que querí que te recuerde y el tiempo! 🐣 (ej: /micah remaindme 1 ya pasó 1 minuto)\n');
    return false;
  }

  setTimeout(()=>{
    bot.sendMessage(chatId, "⏲ "+remainder);
  }, parseInt(time)*1000*60);

  bot.sendMessage(chatId, "⏲ recorcadorio guardado!");
};
