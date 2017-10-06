exports.regex = /micah (culia(a|o|do|da)?|ql[ao]?|ch[uú]?pala|c[aá]?llate|csm)/;
// exports.example = 'micah <chuchada>: Le cuenta tu <secreto> al grupo.'

exports.onMsg = function(bot, msg, match) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "y tu mamá!?");
};
