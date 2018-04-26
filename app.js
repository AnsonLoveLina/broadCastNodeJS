var express = require('express');
var path = require('path');
var broadcast = require("./broadcast.js");

var app = express();

var io = require('socket.io')();

var server = require('http').createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

io.attach(server, {
    //间隔时间ping客户端
    pingInterval: 10000,
    //假如客户端ping超时则关闭链接
    pingTimeout: 5000,
    cookie: false
});

broadcast(io);

module.exports = app;

server.listen(3000);