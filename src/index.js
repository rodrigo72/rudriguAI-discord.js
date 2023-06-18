const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("./config/dbConnection");

const AI = require("./commands/AI");

const joinLogs = require("./joinLogs");
const discordMessageScraper = require("./discordMessageScraper");
const { Client, IntentsBitField, ChannelType, EmbedBuilder } = require("discord.js");
const help = require("./commands/help");
const limits = require("./commands/limits");
const updateLimits = require("./commands/updateLimits");

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

const prefix = "!";

// const targetUsersId = ['706812654207107093'];
// const includedChannels = [
// 	'730159766000631848',
// 	'771898269101850624',
// 	'730896756983726132',
// 	'887836959505014785',
// 	'892106539719077929',
// 	'892105306069409812',
// 	'787143588534026261',
// 	'883437043554873344',
// 	'689476357537005718'
// ];

// const targetServerId = "689476356995547219";
// const limit = 135000;


// client.on("ready", () => {
// 	discordMessageScraper.getMessages(client, ChannelType, targetUsersId, targetServerId, includedChannels, limit);
// })

// joinLogs.joinAllFiles();

const createCompletion = require("./createCompletion.js");
const processChoices = require("./commands/processChoices.js");

const sendMessage = async (channel) => {
	const prompts = [
		'diz uma coisa engraçada',
		'o que achas de capitalimso',
		'diz mal do bruno',
		'nao gosto das aulas',
		'O que é que faço com o meu progresso? ',
		'hj está mau tempo, a chover mto',
		'gosto de comer',
		'minecraft',
		'waifus sao nice',
		'o jogo do gonçalo é nice',
		'gosto de música',
		'adoro radiohead',
		'vamos fazer um filme',
		'esta é uma prompt aleatória',
	]

	const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
	const result = await createCompletion(process.env.CURIE_MODEL, randomPrompt, '\n\n###\n\n', 20);
	const processedResult = processChoices(result.data.choices[0].text);
	console.log('Message sent: ' + processedResult);
	channel.send('[rudriguAI] ' + processedResult);
} 

const generateRandomDelay = () => {
	const minMinutes = 60; // Minimum minutes
	const maxMinutes = 720; // Maximum minutes (24 hours)
  
	const delayMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1) + minMinutes);
  
	return delayMinutes * 60000; // Convert minutes to milliseconds
}

const getRandomChannel = (client) => {
	const channelIds = [
		'730159766000631848',
		'771898269101850624',
		'730896756983726132',
		'887836959505014785',
		'892106539719077929',
		'689476357537005718'
	]
	const randomChannelId = channelIds[Math.floor(Math.random() * channelIds.length)];
	return client.channels.cache.get(randomChannelId);
}

const scheduleMessages = (client) => {
	const numMessages = 3;
  
	for (let i = 0; i < numMessages; i++) {
	  const delay = generateRandomDelay();
	  setTimeout(() => sendMessage(getRandomChannel(client)), delay);
	}
  }

// client.on("ready", async () => {
// 	scheduleMessages(client);
// })

const allowedServers = ["689476356995547219", "942483297005600879", "1076578015808585870"];

connectDB();
mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB.");

	try {
		client.on("messageCreate", async (message) => {

			
			if (allowedServers.includes(message.guild.id)) {	
			
				if (!message.content.startsWith(prefix) || message.author.bot) return;
			
				const args = message.content.slice(prefix.length).split(/ +/);
				const command = args.shift().toLowerCase();
				let executed = true;

				if (!message.author.bot) {
					const random = Math.random();
					if (random < 0.007) {
						AI.execute(message, args, 'normal', 'curie', 'rudrigu');
					}
				}
			
				// warning: CURSED (n pensei q fossem haver tantas AIs)
				if (command === 'curie' || command === 'c') {
					console.log('normal curie command called');
					AI.execute(message, args, 'normal', 'curie', 'rudrigu');
				} else if (command === 'curie_complete' || command === 'cc') {
					console.log('complete curie command called');
					AI.execute(message, args, 'complete', 'curie', 'rudrigu');
				} else if (command === 'ada' || command === 'a') {
					console.log('normal ada command called');
					AI.execute(message, args, 'normal', 'ada', 'rudrigu');
				} else if (command === 'ada_complete' || command === 'ac') {
					console.log('complete ada command called');
					AI.execute(message, args, 'complete', 'ada', 'rudrigu');
				} else if (command === 'davinci' || command === 'd') {
					console.log('normal davinci command called');
					AI.execute(message, args, 'normal', 'davinci', 'rudrigu');
				} else if (command === 'davinci_complete' || command === 'dc') {
					console.log('complete davinci command called');
					AI.execute(message, args, 'complete', 'davinci', 'rudrigu');
				} else if (command === 'ada_qara' || command === 'aq') {
					console.log('normal ada qara command called');
					AI.execute(message, args, 'normal', 'ada', 'qara');
				} else if (command === 'ada_qara_complete' || command === 'aqc') {
					console.log('complete ada qara command called');
					AI.execute(message, args, 'complete', 'ada', 'qara');
				} else if (command === 'ada_bruno' || command === 'ab') {
					console.log('normal ada bruno command called');
					AI.execute(message, args, 'normal', 'ada', 'bruno');
				} else if (command === 'ada_bruno_complete' || command === 'abc') {
					console.log('complete ada bruno command called');
					AI.execute(message, args, 'complete', 'ada', 'bruno');
				} else if (command === 'ada_gonçalo' || command === 'ag') {
					console.log('normal ada gonçalo command called');
					AI.execute(message, args, 'normal', 'ada', 'gonçalo');
				} else if (command === 'ada_gonçalo_complete' || command === 'agc') {
					console.log('complete ada gonçalo command called');
					AI.execute(message, args, 'complete', 'ada', 'gonçalo');
				} else if (command === 'ada_miguel' || command === 'am') {
					console.log('normal ada miguel command called');
					AI.execute(message, args, 'normal', 'ada', 'miguel');
				} else if (command === 'ada_miguel_complete' || command === 'amc') {
					console.log('complete ada miguel command called');
					AI.execute(message, args, 'complete', 'ada', 'miguel');
				} else if (command === 'ada_sofia' || command === 'as') {
					console.log('normal ada sofia command called');
					AI.execute(message, args, 'normal', 'ada', 'sofia');
				} else if (command === 'ada_sofia_complete' || command === 'asc') {
					console.log('complete ada sofia command called');
					AI.execute(message, args, 'complete', 'ada', 'sofia');
				} else if (command === 'ada_adriana' || command === 'aa') {
					console.log('normal ada adriana command called');
					AI.execute(message, args, 'normal', 'ada', 'adriana');
				} else if (command === 'ada_adriana_complete' || command === 'aac') {
					console.log('complete ada adriana command called');
					AI.execute(message, args, 'complete', 'ada', 'adriana');
				} else if (command === 'ada_rui' || command === 'ar') {
					console.log('normal ada rui command called');
					AI.execute(message, args, 'normal', 'ada', 'rui');
				} else if (command === 'ada_rui_complete' || command === 'arc') {
					console.log('complete ada rui command called');
					AI.execute(message, args, 'complete', 'ada', 'rui');
				} else if (command === 'ada_mi' || command === 'ami') {
					console.log('normal ada mi command called');
					AI.execute(message, args, 'normal', 'ada', 'mi');
				} else if (command === 'ada_mi_complete' || command === 'amic') {
					console.log('complete ada mi command called');
					AI.execute(message, args, 'complete', 'ada', 'mi');
				} else if (command === 'ada_lcr' || command === 'al' || command === 'alcr') {
					console.log('complete ada lcr command called');
					AI.execute(message, args, 'normal', 'ada', 'lcr');
				} else if (command === 'ada_lcr_complete' || command === 'alc' || command === 'alcrc') {
					console.log('complete ada lcr command called');
					AI.execute(message, args, 'complete', 'ada', 'lcr');
				} else if (command === 'help' || command === 'h') {
					help.execute(message, EmbedBuilder);
				} else if (command === 'limits' || command === 'l') {
					limits.execute(message, EmbedBuilder);
				} else if (command === 'update_limits' || command === 'ul') {
					updateLimits.execute(message, args);
				} else {
					executed = false;
				}

				if (!executed && message.mentions.has(client.user)) {
					const probability = Math.random();
					if (probability < 0.1) {
						message.reply('<:pepeSUS:907342467521728593>');
					} else if (probability < 0.6) {
						message.reply('<:kermitsip:861712526332788766>');
					}
				}
			}
		});
	} 
	catch (err) {
		console.log(err);
	}
	
	client.login(process.env.DISCORD_TOKEN);
});