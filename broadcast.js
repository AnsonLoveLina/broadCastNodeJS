var getParams = require('./utils/serverUtil');

function firstData(key, socket) {
    tasks.forEach(function (task) {
        if (task.preData && task.preData[key]) {
            socket.emit(task.eventName, task.preData[key]);
            return;
        }
        if (task.preData && task.defaultData) {
            socket.emit(task.eventName, task.defaultData);
        }
    });
}

function register(data, io, socket) {
    if (data.user) {
        var user = data.user;
        //广播接收者
        var roomPeoples = io.sockets.adapter.rooms[user];
        if (roomPeoples != undefined) {
            socket.emit("warn", "重复登录！之前已登录客户端将被注销！");
            for (var loginedSocketId in roomPeoples.sockets) {
                console.log("客户端：" + loginedSocketId + ";" + user + "已注销！");
                socket.to(loginedSocketId).leave(user);
            }
        }

        console.log("客户端：" + socket.id + ";" + user + "登录成功！");
        socket.emit("info", user + "登录成功！");
        socket.join(user);
        firstData(user, socket);

        socket.on("disconnecting", function (reason) {
            console.log(user + "链接关闭，自动注销！");
            socket.leave(user);
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
        console.log("客户端：" + socket.id + "加入群组：" + group + "成功！");
        socket.emit("info", "加入群组：" + group + "成功！");
        socket.join(group);
        firstData(group, socket);

        socket.on("disconnecting", function (reason) {
            console.log("链接关闭，自动退出群组：" + group + "！");
            socket.leave(group);
        });
    }
}

function unRegister(data, io, socket) {
    if (data.user) {
        var user = data.user;
        console.log(user + "链接关闭，自动注销！");
        socket.leave(user);
    } else if (data.group) {
        var group = data.group;
        console.log("链接关闭，自动退出群组：" + group + "！");
        socket.leave(group);
    }
}

function initConnection(io) {
    io.on('connection', function (socket) {
        socket.on("register", function (data) {
            register(data, io, socket);
        });
        socket.on("unRegister", function (data) {
            unRegister(data, io, socket);
        });

        //广播发送者
        socket.on("broadcastInfo", function (data) {
            if (data.roomName && data.eventName && data.text) {
                // console.log("socket:"+socket.id);
                // console.log("namespace:" + data.namespace + ",roomName:" + data.roomName + ",eventName:" + data.eventName + ",text:" + data.text);
                if (data.namespace) {
                    io.of(data.namespace).to(data.roomName).emit(data.eventName, data.text);
                } else {
                    socket.to(data.roomName).emit(data.eventName, data.text);
                }
            } else {
                socket.emit("err", "data格式错误！{roomName,eventName,text,?namespace}");
            }
        });

        socket.on("error", function (error) {
            console.log(error);
        });
    });
}

module.exports = initConnection;