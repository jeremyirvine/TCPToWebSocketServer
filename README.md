# TCP To Websocket Server

Starts a TCP server that takes in a command, and sends it to a specified server via a websocket

## Usage
Open the server, click options, set the ip address, then save and close the options menu. The Server will then test the connection to the server, this usually is instant if the server is valid. A green light will mean a successful connection, a blinking light will mean the program is trying to connect, and a grey light means the connection was unsuccessful.

## Compilation
Requires Node.js and NPM installed on the system for compilation
```
git clone https://github.com/jezza23/TCPToWebSocketServer
cd TCPToWebSocketServer/
npm run-script build
```
Then the output will be placed in the release-builds/