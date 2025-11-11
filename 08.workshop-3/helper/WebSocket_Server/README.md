# Shelly Outbound WebSocket Server

Simple all-in-one server for Shelly devices with Outbound WebSocket support.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm start
```

That's it! The server will automatically detect your WiFi and Ethernet IP addresses and display them on startup.

## 📋 Features

- ✅ WebSocket server for Shelly devices
- ✅ Automatic WiFi & Ethernet IP detection
- ✅ Event handling (TURN_ON, TURN_OFF, TOGGLE)
- ✅ HTTP inspector for debugging
- ✅ Automatic device status caching
- ✅ Config synchronization
- ✅ Graceful shutdown (Ctrl+C)

## 🔧 Configuration

### Configure Your Shelly Devices

When you start the server, it will automatically display your network IP addresses:

```
============================================================
Configure your Shelly devices to connect to:

  ws://192.168.1.100:8080  [Ethernet]
  ws://192.168.1.105:8080  [WiFi]

============================================================
```

**Steps to configure Shelly device:**

1. Open your Shelly device web interface (e.g., http://192.168.1.50)
2. Go to **Settings** → **Outbound WebSocket**
3. Set server URL to one of the addresses shown above (e.g., `ws://192.168.1.100:8080`)
4. Enable the connection
5. Save and restart the device

The server will automatically detect only WiFi and Ethernet interfaces, filtering out Docker, VPN, and virtual adapters.

### Change Port

Edit `shelly_ws_server.js` and change:
```javascript
const PORT = 8080; // Change to your desired port
```

## 🌐 HTTP Endpoints

Once running, you can access:

- **http://localhost:8080/status** - Server status page
- **http://localhost:8080/clients** - List connected devices (JSON)
- **http://localhost:8080/send** - Send RPC commands to devices

### Example: Toggle a Switch

**Browser/URL:**
```
http://localhost:8080/send?clientId=shelly1pmminig4-ccba97c76884&method=Switch.Toggle&params={"id":0}
```

**Using curl:**
```bash
curl 'http://localhost:8080/send?clientId=shelly1pmminig4-ccba97c76884&method=Switch.Toggle&params={"id":0}'
```

### Example: Get Device Status
```
http://localhost:8080/send?clientId=shellypro4pm-083af27b4470&method=Shelly.GetStatus
```

### Example: Turn On a Switch
```
http://localhost:8080/send?clientId=shelly1pmminig4-ccba97c76884&method=Switch.Set&params={"id":0,"on":true}
```

### Example: Turn Off a Switch
```
http://localhost:8080/send?clientId=shelly1pmminig4-ccba97c76884&method=Switch.Set&params={"id":0,"on":false}
```

**Important:** The `params` parameter must be valid JSON format: `{"id":0}` not `id:0`

## 📝 Customization

Edit the `receiveEvents` function in `shelly_ws_server.js` to add your own event handlers:

```javascript
async function receiveEvents(clientId, params) {
    // Add your custom logic here
    for (let event of params.events) {
        if (event.event === "YOUR_CUSTOM_EVENT") {
            // Handle your event
        }
    }
}
```

## 🛑 Stop Server

Press `Ctrl+C` to stop the server gracefully.

## 📚 API Methods

The `shellyOws` object provides these methods:

- `addHandler(method, callback)` - Add event handler
- `call(clientId, method, params)` - Call RPC method on device
- `getState(clientId)` - Get cached device state
- `getConfig(clientId)` - Get cached device config
- `setConfig(clientId, component, config)` - Update device config
- `getClients()` - Get list of connected client IDs

## 🐛 Troubleshooting

**Port already in use:**
- Change the PORT constant in `shelly_ws_server.js`

**Devices not connecting:**
- Check firewall settings (allow port 8080)
- Verify server IP is correct in Shelly device settings
- Ensure devices are on the same network
- Try restarting the Shelly device after configuration

**No IP addresses shown on startup:**
- Make sure you're connected to WiFi or Ethernet
- The server filters out Docker, VPN, and virtual interfaces
- Check with `ifconfig` (Linux/Mac) or `ipconfig` (Windows) to verify your network connection

**Module not found:**
- Run `npm install` to install dependencies

**Server not stopping with Ctrl+C:**
- This has been fixed in the latest version
- The server will force quit after 5 seconds if graceful shutdown fails

## 📄 License

MIT