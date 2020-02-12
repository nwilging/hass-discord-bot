module.exports = {
    name: 'ping',
    description: 'Connection test',
    execute (msg, args) {
        msg.reply('pong');
    }
};