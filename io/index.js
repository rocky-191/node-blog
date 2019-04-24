
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const os = require("os");
const osUtils = require("os-utils");
let interval = -1;
let currCPU = 0;

app.use(express.static(__dirname));

io.sockets.on('connection', function () {//连接事件
    if (interval < 0) {
        interval = setInterval(function () {
            var freeMem = os.freemem();
            var totalMem = os.totalmem();
            let perc=((totalMem - freeMem)/totalMem*100).toFixed(2)
            io.sockets.emit("update", {
                cpuUsage: currCPU,
                usedMem: perc
            });
        }, 3000);//每隔3s取系统数据
    }
});

function updateCPU() {
    osUtils.cpuUsage(function (value) {
        currCPU = (value*100).toFixed(2);
        updateCPU();
    });
}
updateCPU();

server.listen(3000,function(){
    console.log("服务器已启动");
});