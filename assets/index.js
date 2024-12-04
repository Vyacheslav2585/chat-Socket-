const messageContainer = document.querySelector('.messages');
const form = document.querySelector('textarea');
const form1 = document.querySelector('input[type="button"]');
const socket = io();
const con = document.querySelector('.connected');
const dis = document.querySelector('.disconnected');

// Функція для створення повідомлення
function createMessage(text, className) {
    if (text && className) {
        let element = document.createElement('div');
        element.className = className;

        let element1 = document.createElement('p');
        element1.textContent = text;
        element1.className = 'message-content';

        let element2 = document.createElement('div');
        element2.className = 'message-timestamp-left';
        let date = new Date();
        let tile = date.toLocaleTimeString();
        element2.textContent = tile;

        element.appendChild(element1);
        element.appendChild(element2);
        messageContainer.appendChild(element);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
}

// Коли підключаємось до сервера
socket.on('connect', () => {
    con.classList.value = 'connected';
    dis.classList.value = 'hide';
});

// Отримуємо повідомлення від сервера
socket.on('mes', (message) => {
    createMessage(message, 'message-orange'); // Відображаємо отримане повідомлення
});

// Коли відключаємось від сервера
socket.on('disconnect', () => {
    con.classList.value = 'hide';
    dis.classList.value = 'disconnected';
});

// Додаємо нове повідомлення при кліку
form1.addEventListener('click', () => {
    const newMessage = form.value.trim(); // Беремо текст з поля введення
    if (newMessage) {
        createMessage(newMessage, 'message-blue'); 
        socket.emit('newMessage', newMessage); // Відправляємо на сервер
        form.value = ''; // Очищаємо поле введення
    }
   
});
