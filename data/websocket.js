const EventEmitter = require('events');
const WebSocket = require('ws');

const HASS_TOKEN = process.env.HASSIO_TOKEN;
const HASS_URL = process.env.HASS_URL;

const EVENT_MAP = {
    'discord_bot.message': {
        execute(event) {
            return {
                event: 'discord_bot.message',
                data: event.data,
            };
        }
    },
};

class WebsocketClient extends EventEmitter {
    constructor() {
        super();

        this.url = HASS_URL.replace('https', 'ws')
                .replace('http', 'ws')
                + '/websocket';
    }

    start() {
        let ws = new WebSocket(this.url);
        ws.on('open', () => {
            console.log('WebSocket Client Started!');
        });

        ws.on('message', (message) => {
            let json = JSON.parse(message);

            if (json.type === 'auth_required') {
                console.log('Attempting web socket authentication...');
                this.login(ws);
                return;
            }

            if (json.type === 'auth_ok') {
                console.log('Web socket client authenticated!');
                this.subscribeEvents(ws);
                return;
            }

            if (json.type === 'event') {
                // HassIO will only send us events we've subscribed to. No need to check the type to validate, just to determine what to do with the message.
                let event = json.event;

                if (!(event.event_type in EVENT_MAP)) {
                    console.log('Invalid event ' + event.event_type);
                    return;
                }

                console.log('Received event ' + event.event_type);

                let eventToEmit = EVENT_MAP[event.event_type].execute(event);

                this.emit(eventToEmit.event, eventToEmit.data);
                return;
            }

            console.log(json);
        });

        return this;
    }

    login(ws) {
        ws.send(JSON.stringify({
            type: 'auth',
            access_token: HASS_TOKEN,
        }));
    }

    subscribeEvents(ws) {
        ws.send(JSON.stringify({
            id: 1,
            type: 'subscribe_events',
            event_type: 'discord_bot.message'
        }));
    }
}

module.exports = WebsocketClient;