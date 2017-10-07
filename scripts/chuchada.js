exports.regex = /(culia(a|o|do|da)?|ql[ao]?|ch[uú]?pala|c[aá]?llate|csm)/;
// exports.example = 'micah <chuchada>: Le cuenta tu <secreto> al grupo.'

exports.onMsg = function(bot, msg, match) {
  const chatId = msg.chat.id;
  const replies = [
    'u.u perdón',
    'y tu mamá?',
    'y a vo quién te habló?',
    'mas weón que pelear con un bot'
  ];
  bot.sendMessage(chatId, replies[Math.floor(Math.random()*replies.length)]);
};
