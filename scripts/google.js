const google = require('google');

exports.regex = /[Gg]oogle(.*)/;
exports.example = '/micah google <query> <count>: retorna <count> resultados en google para <query>.';

exports.onMsg = function(bot, msg, match) {
  const chatId = msg.chat.id;
  var search = match[1].replace(/^\s+|\s+$/g, '');
  var count = search.split(' ');
  if (count.length > 1) {
    search = search.split(' ');
    count = parseInt(search.pop()) || 1;
    search = search.join(' ');
  }

  if (search === 'help' || search === 'undefined' || !search) {
    bot.sendMessage(chatId, 'Tení que darme lo que querí preguntar po! 🐣 (ej: /micah google lloverá hoy?)\n');
    return false;
  }

  // Send request to google
  google(search, (err, res) => {
    if (err || !res.links || res.links.length === 0) {
      console.log('Oops! from google:'+res);
      bot.sendMessage(chatId, 'Oops! No se encontraron resultados :c');
      return false;
    }

    for (let l in res.links) {
      if (res.links[l].href) {
        bot.sendMessage(chatId, res.links[l].title+'\n'+res.links[l].description+'\n'+res.links[l].href);
        count = count-1;
      }
      if (count < 1) {
        return true;
      }
    }
  });
};
