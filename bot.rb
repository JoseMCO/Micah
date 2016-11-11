require 'telegram/bot'
require 'yaml'
require 'awesome_print'

token = File.read('./botToken').strip
@transmissionAuth = File.read('./transmissionAuth').strip
begin
	@authorizedUsers = YAML::load(File.read('./authorizedUsers'))
rescue
	@authorizedUsers = {}
end

def update_user(user)
	contact = user.attributes
	@authorizedUsers[contact[:id]] = contact.merge(@authorizedUsers[contact[:id]])
	File.write('./authorizedUsers', @authorizedUsers.to_yaml)
end

def handle_user(bot, message)
	bot.api.send_message(chat_id: message.chat.id, text: "Who do we have here?")
	contact = message.contact
	if contact.user_id
		if @authorizedUsers[contact.user_id]
			@authorizedUsers.delete(contact.user_id)
			bot.api.send_message(chat_id: message.chat.id, text: "#{contact.first_name} is no longer authorized to use me.")
		else
			@authorizedUsers[contact.user_id] = contact.attributes
			bot.api.send_message(chat_id: message.chat.id, text: "#{contact.first_name} is now authorized to use me.")
		end
		File.write('./authorizedUsers', @authorizedUsers.to_yaml)
	else
		bot.api.send_message(chat_id: message.chat.id, text: "Ops, looks like #{contact.first_name} doesn't use Telegram.")
	end
end

def list_users(bot, message)
	users = "Authorized users:"
	@authorizedUsers.each do |id, user|
		users += "\n\t #{id}: #{user.phone_number} #{user.first_name}"
	end
	bot.api.send_message(chat_id: message.chat.id, text: users)
end

def add_magnet(bot, message, magnet)
	torrent_name = /&dn=([^&]+)/.match(magnet)[1]
	bot.api.send_message(chat_id: message.chat.id, text: "Adding #{torrent_name} to the queue")
	# add = `transmission-remote -a "#{magnet}" --auth #{@transmissionAuth}`
	# bot.api.send_message(chat_id: message.chat.id, text: add)
end

Telegram::Bot::Client.run(token) do |bot|
	bot.listen do |message|
		if @authorizedUsers[message.from.id]
			# ap message
			update_user(message.from)

			if message.contact
				handle_user(bot, message)

			else

				case message.text
				when /^\/listUsers/, /^\/list_users/
					list_users(bot, message)
				when /^\/addTorrent (.*)/, /^\/add_torrent (.*)/
					add_magnet(bot, message, $1)
				else
					bot.api.send_message(chat_id: message.chat.id, text: "Ops, I don't know what you mean, #{message.from.first_name}.")
				end

			end

		else

			puts "Unallowed user: #{message.from.username} - #{message.from.id}"
			bot.api.send_message(chat_id: message.chat.id, text: "No no no, #{message.from.first_name}, you're not allowed to do that!")

		end

	end
end
