var getParams = require('./utils/serverUtil');

function register(data, io, socket) {
    if (data.user) {
        var user = data.user;
        //广播接收者
        var roomPeoples = io.sockets.adapter.rooms[user];
        if (roomPeoples != undefined) {
            socket.emit("warn", "login repeated!unRegister the older one!");
            for (var loginedSocketId in roomPeoples.sockets) {
                console.log("client:" + loginedSocketId + ";" + user + " is unRegistered!");
                socket.to(loginedSocketId).leave(user);
            }
        }

        console.log("client:" + socket.id + ";" + user + " login success!");
        socket.emit("info", user + " login success");
        socket.join(user);

        socket.on("disconnect", function (reason) {
            console.log("client:" + socket.id + "connection is closed,auto unRegister the user:" + user + "!");
            socket.to(socket.id).leave(user);
            // socket.leave(user);
        });
    } else if (data.group) {
        var group = data.group;
        if (group.indexOf("pairGroup") == 0) {
            var roomPeoples = io.sockets.adapter.rooms[group];
            //第二个注册的人会发送offer
            if (roomPeoples != undefined) {
                socket.emit("pairOffer", true);
            } else {
                socket.emit("pairOffer", false);
            }
        }
        console.log("client:" + socket.id + " join the group:" + group + " success!");
        socket.emit("info", "join the group:" + group + " success!");
        socket.join(group);

        socket.on("disconnect", function (reason) {
            console.log("client:" + socket.id + "connection is closed,auto unRegister the group:" + group + "!");
            socket.to(socket.id).leave(group);
            // socket.leave(group);
        });
    }
}

function unRegister(data, io, socket) {
    if (data.user) {
        var user = data.user;
        console.log("unRegister the user" + user + "!");
        socket.leave(user);
    } else if (data.group) {
        var group = data.group;
        console.log("unRegister the group:" + group + "!");
        socket.leave(group);
    }
}

function parseJson(data, socket) {
    if ("string" == typeof data) {
        // console.log(data);
        try {
            data = JSON.parse(data);
        } catch (e) {
            socket.emit("err", "json parse error!" + data);
        }
    }
    return data;
}

function initConnection(io) {
    io.on('connection', function (socket) {
        socket.on("register", function (data) {
            data = parseJson(data, socket);
            register(data, io, socket);
        });
        socket.on("unRegister", function (data) {
            data = parseJson(data, socket);
            unRegister(data, io, socket);
        });

        //广播发送者
        socket.on("broadcastInfo", function (data) {
            data = parseJson(data, socket);
            if (data.roomName && data.eventName && data.text) {
                console.log("socket:" + socket.id);
                console.log("namespace:" + data.namespace + ",roomName:" + data.roomName + ",eventName:" + data.eventName + ",text:" + data.text);
                var roomPeoples = io.sockets.adapter.rooms[data.roomName];
                if (!roomPeoples) {
                    socket.emit("info", "roomName:" + data.roomName + "not exists!");
                    return;
                }
                if (data.namespace) {
                    io.of(data.namespace).to(data.roomName).emit(data.eventName, data.text);
                } else {
                    socket.to(data.roomName).emit(data.eventName, data.text);
                }
            } else {
                socket.emit("err", "data fromat error!{roomName,eventName,text,?namespace}");
            }
        });

        socket.on("reconnect", function (data) {
            console.log("reconnect:" + data);
        });

        socket.on("error", function (error) {
            console.log(error);
        });
    });
}

module.exports = initConnection;