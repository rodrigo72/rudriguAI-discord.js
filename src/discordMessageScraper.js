const path = require('path');
const fs = require('fs');

const fetchMessages = async (channel, limit) => {
	try {
	  	let messages = [];
		let lastId = null;
  
		do {
			const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
			messages.push(...fetchedMessages.values());
			lastId = fetchedMessages.last()?.id;
			console.log("Messages fetched: ", messages.length);
			if (messages.length > limit) break;
		} while (lastId);
  
	  	return messages;
	} catch (error) {
	  	console.error('Error fetching messages:', error);
	  	return [];
	}
};

const getRepliedMessage = (message, messages) => {
    if (message.reference && message.reference.messageId) {
        return messages.find((m) => m.id === message.reference.messageId);
    }
    return null;
}

const getMessages = async (client, ChannelType, targetUserId, targetServerId, includedChannels, limit) => {
	const targetServer = client.guilds.cache.get(targetServerId);
	if (!targetServer) return console.log('Server not found!');
	else console.log('Server found:' + targetServer.name + '!');

	targetServer.channels.cache.forEach(async (channel) => {
		if (channel.type === ChannelType.GuildText && includedChannels.includes(channel.id)) {
			console.log("Reading: ", channel.name);
			const messages = await fetchMessages(channel, limit);

			if (messages.length > 0) {

                const lines = [];

                for (elem of messages) {
                    if (targetUserId.includes(elem.author?.id)) {
                        const repliedMessage = getRepliedMessage(elem, messages);
                        if (repliedMessage && !targetUserId.includes(repliedMessage.author?.id && !repliedMessage.author.bot) 
							&& repliedMessage.content.length > 2 && elem.content.length > 2
							&& elem.content.charAt(0) !== '!' && elem.content.charAt(0) !== '$') {
                            lines.push({ prompt: repliedMessage.content, completion: elem.content});
                        }
                    }
                }

				if (lines.length > 0) {

					console.log("Total lines: ", lines.length);

                    const lineToJSONL = (line) => JSON.stringify(line) + '\n';
                    const jsonlData = lines.map(lineToJSONL).join('');
					const channleLog = path.join(__dirname, "logs", channel.name + ".jsonl");

					if (!fs.existsSync(channleLog)) fs.writeFileSync(channleLog, "");

					fs.appendFileSync(
						channleLog, 
						jsonlData,
                        (err) => { if (err) console.log(err); }
					)
				} else {
					console.log("No messages found!");
				}
			} else {
				console.log("No messages found!");
			}
		}
	});
}

module.exports = { getMessages };