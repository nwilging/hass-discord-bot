const EventEmitter = require('events');
const express = require('express');

class HttpServer extends EventEmitter {
    constructor(port) {
        super();
        this.port = port;
    }

    start() {
        this.app = express();
        this.app.listen(this.port, () => console.log('HTTP Server started'));
    }
}

module.exports = HttpServer;