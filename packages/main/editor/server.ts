class Server{

    constructor(){
        const http = require('http');
        const express = require('express');
        const socketIo = require('socket.io');
        
        const app = express();
        const server = http.createServer(app);
        const io = socketIo(server);
        
        // 当有新的连接时触发
        io.on('connection', (socket: any) => {
          console.log('new connection');
        
          // 监听客户端发送的消息
          socket.on('message', (message: any) => {
            // console.log('onmessage:', message);
            socket.broadcast.emit('message', message);
          });
        
          // 监听客户端断开连接
          socket.on('disconnect', () => {
            console.log('连接断开');
          });
        });
        
        const PORT = process.env.PORT || 5010;
        
        server.listen(PORT, () => {
          console.log(`Socket.IO running on http://localhost:${PORT}`);
        });
    }

}

export { Server }