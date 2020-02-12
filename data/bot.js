const Discord = require('discord.js');
const commands = require('./commands');

const HELLO = [
    'Hello to you too.',
    'At your service.',
    'Your wish is my command.',
    'Let\'s get freaky.',
    'You rang?',
    'What the fuck do you want?',
    'Shut your mouth when you are talking to me.',
    'How may I help you?',
    'I serve in the name of Mother Russia.',
    'It is I, Home Bot!',
    'Right back at you.',
];

const bot = new Discord.Client();

function onReady() {
    console.log(`Logged in as ${bot.user.tag}!`);
}

function onMessage(msg) {
    if (msg.content.startsWith('!bot')) {
        let args = msg.content.split(/ +/);
        args.shift();

        handleCommand(msg, args);
    }
}

function handleCommand(msg, args) {
    if (args.length === 0) {
        let reply = HELLO[Math.floor(Math.random() * HELLO.length)];
        msg.reply(reply);
        return;
    }

    let command = args.shift().toLowerCase();

    console.info(`Received command ${command}`);

    if (!bot.commands.has(command)) {
        msg.reply('Sorry, I didn\'t understand that.');
        return;
    }

    try {
        bot.commands.get(command).execute(msg, args);
    } catch (err) {
        console.log(err);
        msg.reply('Sorry, I didn\'t understand that.');
    }
}

function handleWebsocketEvent(data) {
    let message = data.message;
    let desiredChannel = data.channel;

    if (!message || !desiredChannel) {
        console.log('Missing data: message, desired channel.');
        return;
    }

    let channels = bot.channels;
    let sent = false;

    channels.forEach((channel) => {
        if (channel.type === 'text' && channel.name === desiredChannel) {
            channel.send(message);
            sent = true;
            return;
        }
    });

    if (!sent) {
        console.log('There was an error sending the message for event.');
    }
}

class Bot {
    constructor(config, websocketClient) {
        this.config = config;
        this.websocketClient = websocketClient;
    }

    start() {
        let token = this.config.discord_token;

        bot.commands = new Discord.Collection();
        Object.keys(commands).map((key) => {
            bot.commands.set(commands[key].name, commands[key]);
        });

        bot.login(token);

        this.websocketClient.on('discord_bot.message', handleWebsocketEvent);

        bot.on('ready', onReady);
        bot.on('message', onMessage);
    }
}
module.exports = Bot;