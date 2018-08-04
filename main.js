const {app, BrowserWindow} = require('electron')
const path = require("path")
const ip = require("ip")
const express = require("express")
const server = express()  
const http = require("http").Server(server)
const io = require("socket.io")(http)
const $ = require("./node_modules/jquery/dist/jquery.js")
const fs = require("fs")
const _ = require("underscore")
const net = require("net")
const WS = require("ws")
const Store = require("electron-store")
const store = new Store()
const spawn = require("threads").spawn

let console_ip = "ws://" + store.get("switch_ip") + ":" + store.get("switch_port") + "/"


if(store.get("switch_ip") == undefined) {
  store.set("switch_ip", "192.168.1.81")
}
if(store.get("switch_port") == undefined) {
  store.set("switch_port", 8621)
}

console.log(console_ip)

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL("http://" + ip.address() + ":8001")
  win.setResizable(false)
  console.log(ip.address() + ":8001")
}

function openOptions() {
  options = new BrowserWindow({width:400, height: 300})
  options.loadURL("file://" + path.join(__dirname, "options.html"))
  options.setResizable(false)
  options.on("close", () => {
    io.emit("reload", store.get("switch_ip"))
  })
}

var clients = []

let netserver = net.createServer((socket) => {
  
  clients.push(socket)
  socket.write("Welcome\r\n")
  console.log("Net Client Connected")
  io.emit("client update", clients.length)
  socket.on("data", (e) => {
    io.emit("command", "" + e.toString())
    let ws = new WS("ws://192.168.1.81:8621")
    ws.on("open", () => {
      ws.send("" + e.toString())
      ws.close()
    })
  })
  socket.on("end", () => {
    clients.splice(clients.indexOf(socket), 1)
    io.emit("client update", clients.length)
  })
})

netserver.listen(1289)



// app.on('ready', createWindow)

var io_clients = [] 

io.on("connect", (socket) => {
  console.log("Client Connected!")
  io_clients.push(socket)
  io.emit("client update", clients.length)
  socket.on("open options", function(e) {
    console.log("opening options")
    openOptions()
  })
  io.on("disconnect", function() {
    io_clients.splice(io_clients.indexOf(socket), 1)
    
  })
})



server.set("view engine", "ejs")
server.set('views', __dirname + '/Views');

server.use(express.static(__dirname + "/Public"))

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.get("/", (req, res) => {
  res.render("index", {
    openOptions: openOptions,
    store: store,
    ip: ip.address()
  })
})

http.listen(8001, function() {
  console.log("Backend Server Started!")
  app.on('ready', createWindow)
})