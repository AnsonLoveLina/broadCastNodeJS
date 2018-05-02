# 广播
    server端主动发送广播给客户端
  
## client javascript
    请求目录下有对应JS包，目前采用socket.io 2.1.0
    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    
- 代码例子


    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    <script>
        var socket = io.connect('http://localhost:3000');
        socket.on("connect",function () {
            socket.emit("register", {"userName": "6A2C1FBC70FE38EEE050007F010061E5"});
        });
    
        socket.on("receive", function (data) {
            console.log(data)
        });
    
        function sendGroupRegister() {
            socket.emit("register", {"group": "vvv"});
        }
    
        function sendUserNameDCN() {
            var data = {};
            data.roomName = "xxx";
            data.eventName = "countMsg";
            data.text = 99;
            socket.emit("broadcastInfo", data);
        }
    
        function sendGroupDCN() {
            var data = {};
            data.roomName = "vvv";
            data.eventName = "countMsg";
            data.text = 100;
            socket.emit("broadcastInfo", data);
        }
    </script>
    
客户端可以发送三个公共事件：register,unRegister,broadcastInfo。

#####register

- 用户名，重复注册，会自动注销之前注册的用户

例子：{"userName": "6A2C1FBC70FE38EEE050007F010061E5"}

- 群组，允许重复注册

例子：{"group": "vvv"}

#####unRegister

- 注销用户名

例子：{"userName": "6A2C1FBC70FE38EEE050007F010061E5"}

- 注销群组

例子：{"group": "vvv"}

#####broadcastInfo

- roomName
发送房间名

- eventName
发送事件名称

- text
发送内容

例子：{"roomName":"xxx","eventName":"countMsg","text":"99"}
{"roomName":"xxx","eventName":"countMsg","text":{"data","sdfdsf"}}

## client java

之后补充！！！！