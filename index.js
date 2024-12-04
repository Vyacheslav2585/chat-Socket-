const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
    }
});

app.get('/',(req, res)=>{
    res.sendFile(__dirname+'/assets/index.html')
})
app.use(express.static(__dirname+'/assets'))
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Отримуємо повідомлення від клієнта
    socket.on('newMessage', (message) => {
        console.log('Received message:', message);
        // Відправляємо повідомлення всім підключеним клієнтам
        socket.broadcast.emit('mes', message);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(5000, () => {
    console.log('Server started on port 5000');
});
