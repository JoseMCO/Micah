const request = require('request');

exports.regex = /countdown(.*)/;
exports.example = '/micah countdown <serie>: Muestra el tiempo faltante para el próximo capítulo de <serie>.'

exports.onMsg = function(bot, msg, match) {
  const chatId = msg.chat.id;

  const search = escape(match[1].toLowerCase());
  if (search === '%20help' || search === 'undefined' || !search) {
    bot.sendMessage(chatId, 'Tení que darme el nombre de la serie po! 🐣 (ej: /micah countdown mr robot)\n');
    return false;
  }

  // Send request to the tvmaze search API
  request("http://api.tvmaze.com/search/shows?q=" + search, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      bot.sendMessage(chatId, 'Oops! '+err);
      return false;
    }

    const data = JSON.parse(body);

    if (data.length === 0) {
      bot.sendMessage(chatId, '¿Seguro que ese es el nombre? ¡Tienes que elegir una serie que exista! 🐣');
    } 
    else {

      const show_name = data[0].show.name;
      const ep_link = data[0].show._links.nextepisode;

      if (!ep_link) {
        bot.sendMessage(chatId, show_name+' no tiene más fechas! 😢');
      } 
      else {
        // Send request to the tvmaze episode API
        request(ep_link.href, (err, res, body) => {
          if (err || res.statusCode !== 200) {
            bot.sendMessage(chatId, 'Oops! Status code: '+res.statusCode);
          }

          const data = JSON.parse(body);

          if (!data) {
            bot.sendMessage(chatId, '¿Seguro que ese es el nombre? ¡Tienes que elegir una serie que exista! 🐣');
          } 
          else {
            const ep_name = data.name; 
            const ep_date = new Date(data.airstamp); 
            const ep_tag = +data.season+"x"+data.number; 

            const distance = ep_date - new Date(); 
            const _second = 1000; 
            const _minute = _second * 60; 
            const _hour = _minute * 60; 
            const _day = _hour * 24; 

            const days = Math.floor(distance / _day); 
            const hours = Math.floor((distance % _day) / _hour); 
            const minutes = Math.floor((distance % _hour) / _minute); 
            const seconds = Math.floor((distance % _minute) / _second); 
            const count = days+"d "+hours+"h "+minutes+"m y "+seconds+"s 🍿"; 
            const date_options = {
              year: 'numeric', month: 'numeric', day: 'numeric',
              hour: 'numeric', minute: 'numeric',
              hour12: false
            }
            const result = show_name+" ("+ep_tag+": "+ep_name+") sale el "+new Intl.DateTimeFormat('es-CL', date_options).format(ep_date)+" y quedan "+count; 

            bot.sendMessage(chatId, result);
          }
        });
      }
    }
  });
};
