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
    if (data.userName) {
        var userName = data.userName;
        //广播接收者
        var roomPeoples = io.sockets.adapter.rooms[userName];
        if (roomPeoples != undefined) {
            socket.emit("warn", "重复登录！之前已登录客户端将被注销！");
            for (var loginedSocketId in roomPeoples.sockets) {
                console.log("客户端：" + loginedSocketId + ";" + userName + "已注销！");
                socket.to(loginedSocketId).leave(userName);
            }
        }

        console.log("客户端：" + socket.id + ";" + userName + "登录成功！");
        socket.emit("info", userName + "登录成功！");
        socket.join(userName);
        firstData(userName, socket);

        socket.on("disconnecting", function (reason) {
            console.log(userName + "链接关闭，自动注销！");
            socket.leave(userName);
        });
    } else if (data.group) {
        var group = data.group;
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
    if (data.userName) {
        var userName = data.userName;
        console.log(userName + "链接关闭，自动注销！");
        socket.leave(userName);
    } else if (data.group) {
        var group = data.group;
        console.log("链接关闭，自动退出群组：" + group + "！");
        socket.leave(group);
    }
}

function initConnection(io, tasks) {
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
                if (data.namespace) {
                    io.of(data.namespace).to(data.roomName).emit(data.eventName, data.text);
                } else {
                    io.to(data.roomName).emit(data.eventName, data.text);
                }
            } else {
                socket.emit("err", "data格式错误！{userName,eventName,text,?namespace}");
            }
        });

        socket.on("error", function (error) {
            console.log(error);
        });
    });
}

module.exports = initConnection;