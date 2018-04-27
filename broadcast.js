var getUserName = require('./util');

function initConnection(io) {
    io.on('connection', function (socket) {
        var url = socket.request.url;
        var userName = getUserName(url);
        if (userName) {
            //广播接收者
            var roomPeoples = io.sockets.adapter.rooms[userName];
            if (roomPeoples != undefined) {
                socket.emit("warn", "重复登录！之前已登录客户端将被注销！");
                for (var loginedSocketId in roomPeoples.sockets) {
                    console.log("客户端：" + loginedSocketId + ";" + userName + "已注销！");
                    io.to(loginedSocketId).leave(userName);
                }
            }
            console.log("客户端：" + socket.id + ";" + userName + "登录成功！");
            socket.emit("info", userName + "登录成功！");
            socket.join(userName);

            socket.on("disconnecting", function (reason) {
                console.log(userName + "链接关闭，自动注销！");
                socket.leave(userName);
            });
        } else {
            //广播发送者
            socket.on("broadcastInfo", function (data) {
                if (data.userName && data.eventName && data.text) {
                    if (data.namespace) {
                        io.of(data.namespace).to(data.userName).emit(data.eventName, data.text);
                    } else {
                        io.to(data.userName).emit(data.eventName, data.text);
                    }
                } else {
                    socket.emit("err","data格式错误！{userName,eventName,text,?namespace}");
                }
            });
        }
    });
}

module.exports = initConnection;