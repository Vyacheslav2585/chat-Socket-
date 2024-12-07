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

let names = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/assets/index.html');
});

app.use(express.static(__dirname + '/assets'));

// Обробка підключення користувача
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}, Total users: ${io.engine.clientsCount}`);

    // Оновлюємо кількість підключень
    io.emit('count', io.engine.clientsCount);

    // Отримання та відправка повідомлень
    socket.on('newMessage', (message) => {
        const name = names.find(item => item.id === socket.id);
        if (name) {
            console.log(`User ${name.name} sent message: "${message}"`);
        } else {
            console.log(`Unknown user with ID: ${socket.id} sent message: "${message}"`);
        }
        socket.broadcast.emit('mes', message,name.name);
    });

    // Додаємо нового користувача
    socket.on('SetUser', (name) => {
        names.push({ name, id: socket.id });
        io.emit("NewUser", names); // Оновлення для всіх клієнтів
    });

    // Обробка відключення
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Видаляємо користувача зі списку
        names = names.filter((item) => item.id !== socket.id);

        io.emit("NewUser", names); // Оновлення списку користувачів
        io.emit('count', io.engine.clientsCount);
    });
});

// Запуск сервера
server.listen(5000, () => {
    console.log('Server started on port 5000');
});
