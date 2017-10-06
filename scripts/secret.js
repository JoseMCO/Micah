exports.regex = /micah secret (.*)/;
exports.example = 'micah secret <secreto>: Le cuenta tu <secreto> al grupo.'

exports.onMsg = function(bot, msg, match) {
  const chatId = msg.chat.id;

  const txt = escape(match[1].toLowerCase());
  if (txt == 'undefined' || !txt) {
    bot.sendMessage(chatId, 'Tení que darme un secreto po! (ej: /micah secret chúpalo)\n');
    return false;
  }

  bot.sendMessage(this.config.telegram.group_id, '🙊 '+msg.text.replace(/(\/?micah secret)/,''));
};
