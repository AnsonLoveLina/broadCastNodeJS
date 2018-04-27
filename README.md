# 广播
    server端主动发送广播给客户端
  
## client javascript
    js目录下有对应javascript的第三方包
    
- 代码例子


    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    <script>
        var socket = io.connect('http://localhost:3000?userId=xxx');
        socket.on("countMsg",function (data) {
            console.log(data)
        });
    
        var sendSocket = io.connect('http://localhost:3000');
        function sendDCN() {
            var data = {};
            data.userName = "xxx";
            data.eventName = "countMsg";
            data.text = 99;
            sendSocket.emit("broadcastInfo",data);
        }
    </script>
    
