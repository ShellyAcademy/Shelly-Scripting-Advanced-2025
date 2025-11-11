const http = require('http');
const {WebSocketServer, WebSocket} = require('ws');
const os = require('os');

const DEBUG = true;
const PORT = 8080;

// ============================================================================
// Get Network Interfaces
// ============================================================================

function getLocalIPAddresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    
    // Common interface name patterns for WiFi and Ethernet
    const wifiPatterns = ['wlan', 'wifi', 'wi-fi'];
    const ethernetPatterns = ['eth', 'en', 'eno', 'enp', 'ens'];
    
    for (const name of Object.keys(interfaces)) {
        const nameLower = name.toLowerCase();
        
        // Check if it's WiFi or Ethernet
        const isWiFi = wifiPatterns.some(pattern => nameLower.includes(pattern));
        const isEthernet = ethernetPatterns.some(pattern => nameLower.startsWith(pattern));
        
        if (isWiFi || isEthernet) {
            for (const iface of interfaces[name]) {
                // Skip internal (loopback) and non-IPv4 addresses
                if (iface.family === 'IPv4' && !iface.internal) {
                    addresses.push({
                        name: name,
                        address: iface.address,
                        type: isWiFi ? 'WiFi' : 'Ethernet'
                    });
                }
            }
        }
    }
    
    return addresses;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Simple object check.
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

// ============================================================================
// ShellyOWS Class
// ============================================================================

class ShellyOWS {
    handlers = {};
    _idx = 0;
    httpServer = null;
    _clients = {};
    _statuses = {};
    _config = {};
    _requests = {};
    ws = null;

    constructor(httpServer) {
        this.httpServer = httpServer;
        this.init();
    }

    init() {
        this.ws = new WebSocketServer({server: this.httpServer});
        this.ws.on('connection', async (webSocket, request, client) => {
            if (DEBUG) {
                console.log('New connection: ', request.socket.remoteAddress);
            }

            webSocket.on('message', async (message) => {
                message = JSON.parse(message.toString());

                this._clients[message.src] = webSocket;
                webSocket.clientId = message.src;

                let [model, deviceId] = message.src.split("-");

                if (message.method) {
                    let method = message.method;
                    let params = message.params;

                    if (method === "NotifyFullStatus") {
                        this._statuses[message.src] = params;
                        let allConfig = await this.call(message.src, "Shelly.getconfig");
                        this._config[message.src] = allConfig;
                    }
                    else if (method === "NotifyStatus") {
                        this._statuses[message.src] = mergeDeep(this._statuses[message.src] || {}, params);
                    }
                    else if (method === "NotifyEvent") {
                        for (let event of params.events) {
                            if (event.event === "config_changed") {
                                let config = await this.call(message.src, event.component + ".getconfig");
                                this._config[message.src][event.component] = config;
                            }
                        }
                    }

                    // proceed to call handlers
                    if (this.handlers[method]) {
                        this._callHandler(method, message.src, params, webSocket);
                    }
                }
                else if (message.result) {
                    if (message.id && this._requests[message.id]) {
                        this._requests[message.id](message.result);
                    }
                }
            });

            await this.call(webSocket, "shelly.getdeviceinfo");
        });
        
        this.ws.on('close', (webSocket) => {
            this._callHandler("OWS::Disconnected", webSocket.clientId, undefined, webSocket);
            delete this._clients[webSocket.clientId];
        })
    }

    _callHandler(method, id, params, webSocket) {
        if (this.handlers[method]) {
            let [model, deviceId] = id.split("-");

            for (let k of Object.keys(this.handlers[method])) {
                let cb = this.handlers[method][k];

                try {
                    cb.call(this, id, params, webSocket, model, deviceId);
                } catch (ex) {
                    console.error("Handler", method, 'thrown error:', ex);
                }
            }
        }
    }

    addHandler(method, cb) {
        let id = this._idx++;
        if (!this.handlers[method]) {
            this.handlers[method] = {};
        }
        this.handlers[method][id] = cb;
        return id;
    }

    removeHandler(method, id) {
        delete this.handlers[method][id];
    }

    call(deviceIdOrWebSocket, method, params) {
        let webSocket = deviceIdOrWebSocket instanceof WebSocket ?
            deviceIdOrWebSocket : this._clients[deviceIdOrWebSocket];

        if (!webSocket) {
            return Promise.reject(404);
        }

        return new Promise((res, rej) => {
            let id = this._idx++;
            this._requests[id] = (response) => {
                res(response);
            };

            let req = {"jsonrpc":"2.0", "id": id, "src":"wsserver", "method": method};
            if (params) {
                req['params'] = params;
            }
            webSocket.send(JSON.stringify(req));
        });
    }

    getState(clientId) {
       return this._statuses[clientId] || {};
    }

    getConfig(clientId) {
        return this._config[clientId] || {};
    }

    async setConfig(clientId, component, config) {
        component = component.toLowerCase();
        await this.call(clientId, component + ".setconfig", {'config': config});
        this._config[clientId][component] = mergeDeep(this._config[clientId][component] || {}, config);
        return this._config[clientId][component];
    }

    getClients() {
        return Object.keys(this._clients);
    }
}

// ============================================================================
// HTTP Inspector (Optional - for debugging)
// ============================================================================

function setupInspector(httpServer, shellyOws) {
    const url = require('url');
    
    httpServer.on('request', async (req, res) => {
        let parsedUrl = url.parse(req.url, true);
        switch (parsedUrl.pathname) {
            case "/clients":
                res.writeHead(200, { 'Content-Type': 'application/json' });
                let clients = shellyOws.getClients();
                res.write(JSON.stringify(clients));
                res.end();
                break;

            case "/send":
                let params = parsedUrl.query;
                try {
                    let result = await shellyOws.call(
                        params.clientId,
                        params.method,
                        params.params ? JSON.parse(params.params) : undefined
                    );
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify(result));
                    res.end();
                } catch (ex) {
                    console.error(ex);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({'error': ex.toString()}));
                    res.end();
                }
                break;

            case "/status":
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(`
                    <html>
                    <head><title>Shelly OWS Server</title></head>
                    <body>
                        <h1>Shelly Outbound WebSocket Server</h1>
                        <p>Server is running on port ${PORT}</p>
                        <p>Connected clients: ${shellyOws.getClients().length}</p>
                        <h2>Endpoints:</h2>
                        <ul>
                            <li>GET /clients - List connected clients</li>
                            <li>GET /send?clientId=XXX&method=YYY&params={} - Send RPC command</li>
                            <li>GET /status - This page</li>
                        </ul>
                    </body>
                    </html>
                `);
                res.end();
                break;

            default:
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("404 - Not Found");
                res.end();
                break;
        }
    });
}

// ============================================================================
// Event Handlers
// ============================================================================

async function receiveEvents(clientId, params) {
    console.log('Event from:', clientId);
    console.log('Params:', JSON.stringify(params, null, 2));

    for (let eventIdx in params.events) {
        let event = params.events[eventIdx];
        console.log('Processing event:', event.event);
        
        if (event.event === "TURN_ON") {
            console.log("Turning on", event.data.dst);
            await this.call(event.data.dst, "Switch.Set", {"id": event.data.id, "on": true});
        } else if (event.event === "TURN_OFF") {
            console.log("Turning off", event.data.dst);
            await this.call(event.data.dst, "Switch.Set", {"id": event.data.id, "on": false});
        } else if (event.event === "TOGGLE") {
            console.log("Toggling", event.data.dst);
            await this.call(event.data.dst, "Switch.Toggle", {"id": event.data.id});
        }
    }
}

// ============================================================================
// Main Server
// ============================================================================

console.log('='.repeat(60));
console.log('Shelly Outbound WebSocket Server');
console.log('='.repeat(60));

const httpServer = http.createServer();
const shellyOws = new ShellyOWS(httpServer);

// Setup HTTP inspector for debugging
setupInspector(httpServer, shellyOws);

// Add event handlers
shellyOws.addHandler("NotifyEvent", receiveEvents);

// Start server
httpServer.listen(PORT, () => {
    const addresses = getLocalIPAddresses();
    
    console.log(`✓ Server started successfully!`);
    console.log(`✓ WebSocket server listening on port ${PORT}`);
    console.log(`✓ HTTP inspector available at http://localhost:${PORT}/status`);
    console.log('='.repeat(60));
    console.log('Configure your Shelly devices to connect to:');
    console.log('');
    
    if (addresses.length > 0) {
        addresses.forEach(iface => {
            console.log(`  ws://${iface.address}:${PORT}  [${iface.type}]`);
        });
    } else {
        console.log(`  No WiFi or Ethernet interface found!`);
        console.log(`  Make sure you are connected to a network.`);
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('Waiting for connections...\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nShutting down gracefully...');
    
    // Close all WebSocket connections
    shellyOws.ws.clients.forEach((client) => {
        client.close();
    });
    
    // Close WebSocket server
    shellyOws.ws.close(() => {
        console.log('WebSocket server closed');
    });
    
    // Close HTTP server
    httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
    
    // Force exit after 5 seconds if graceful shutdown fails
    setTimeout(() => {
        console.log('Forcing exit...');
        process.exit(1);
    }, 5000);
});