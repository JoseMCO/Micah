exports.regex = /micah (culiao|ql|qlo|chupala|chúpala)/;
// exports.example = 'micah <chuchada>: Le cuenta tu <secreto> al grupo.'

exports.onMsg = function(bot, msg, match) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "y tu mamá!?");
};
