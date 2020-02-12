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

class Bot {
    constructor(config) {
        this.config = config;
    }

    start() {
        let token = this.config.discord_token;

        bot.commands = new Discord.Collection();
        Object.keys(commands).map((key) => {
            bot.commands.set(commands[key].name, commands[key]);
        });

        bot.login(token);

        bot.on('ready', onReady);
        bot.on('message', onMessage);
    }
}
module.exports = Bot;