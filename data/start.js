const fs = require('fs');

const CONFIG_PATH = '/data/options.json';
let config = JSON.parse(fs.readFileSync(CONFIG_PATH));

process.env.DISCORD_TOKEN = config.discord_token;
process.env.HASS_URL = 'http://hassio/homeassistant/api';

async function loadNamedEntities() {
    const EntityLoader = require('./entity-loader');
    let namedEntityLoader = new EntityLoader(config);
    global.NAMED_ENTITIES = await namedEntityLoader.load();
    console.log('Loaded ' + Object.keys(global.NAMED_ENTITIES).length + ' named entities.');
}

async function startDiscordBot(websocketClient) {
    const DiscordBot = require('./bot');
    let bot = new DiscordBot(config, websocketClient);
    await bot.start();
}

async function startHttpService() {
    const HTTPServer = require('./server');
    let server = new HTTPServer(3000);
    server.start();
}

async function startWebSocketService() {
    const WebSocketClient = require('./websocket');
    let client = new WebSocketClient();
    return await client.start();
}


(async () => {
    await loadNamedEntities();
    await startHttpService();
    let wsClient = await startWebSocketService();
    await startDiscordBot(wsClient);
})();