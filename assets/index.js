const messageContainer = document.querySelector('.messages');
const form = document.querySelector('textarea');
const form1 = document.querySelector('input[type="button"]');
const List = document.querySelector('.listUsers');
const socket = io();
const con = document.querySelector('.connected');
const dis = document.querySelector('.disconnected');
const countEl = document.querySelector('.number-message');


    let nameT = localStorage.getItem('name')
    let name1
    if(nameT){
        name1 =nameT
    }else {
        name1 = prompt("Виберіть ім'я")
        localStorage.setItem('name',name1)
    }
    if (name1) {
        name1 =name1.substring(0,15);
        name1 = name1.charAt(0).toUpperCase() + name1.slice(1)
        socket.emit("SetUser", name1);
    }


function playSound() {
    const audio = new Audio('./mess.mp3');  // Створюємо новий об'єкт Audio
    audio.play();  // Відтворюємо звук
}

function createMessage(text, className,name) {
    if (text && className) {
        playSound()
        // Заміна імені в тексті на виділене
        const regex = new RegExp(`(${name1})`, 'g');  // Шукаємо ім'я
        const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');  // Додаємо <span> з класом

        let element = document.createElement('div');
        element.className = className;

        let element1 = document.createElement('p');
        element1.className = 'message-content';
        element1.innerHTML = highlightedText; // Використовуємо innerHTML для вставки HTML

        let element2 = document.createElement('div');
        element2.className = 'message-timestamp-left';
        let date = new Date();
        element2.textContent = date.toLocaleString();

        let NameElement = document.createElement('div');
        NameElement.className = 'NameElement'
        NameElement.textContent = name

        element.appendChild(NameElement)
        element.appendChild(element1);
        element.appendChild(element2);
        messageContainer.appendChild(element);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
}

socket.on('connect', () => {
    con.classList.value = 'connected';
    dis.classList.value = 'hide';
});

socket.on('NewUser', (array) => {
    List.innerHTML = ''; // Очищаємо список
    array.forEach(element => {
        
        const newUser = document.createElement('li');
        if(element.name==name1){
            newUser.className = 'userName1';
        }else{
            newUser.className = 'userName';
        }
        newUser.textContent = element.name;

        newUser.onclick = () => {
            form.value = ''; // Очищаємо поле
            form.value = form.value + element.name + ":"; // Додаємо ім'я користувача
            form.focus(); // Ставимо фокус на textarea
        };

        List.appendChild(newUser);
    });
});

socket.on('mes', (message,name) => {
    createMessage(message, 'message-orange',name);
});

socket.on('disconnect', () => {
    con.classList.value = 'hide';
    dis.classList.value = 'disconnected';
});

socket.on('count', (count) => {
    countEl.textContent = count;
});

form1.addEventListener('click', () => {
    const newMessage = form.value.trim();
    if (newMessage) {
        createMessage(newMessage, 'message-blue');
        socket.emit('newMessage', newMessage);
        form.value = ''; // Очищаємо поле після відправки
    }
});

form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Запобігаємо стандартній поведінці Enter
        const newMessage = form.value.trim();
        if (newMessage) {
            createMessage(newMessage, 'message-blue');
            socket.emit('newMessage', newMessage);
            form.value = ''; // Очищаємо поле після відправки
        }
    }
});
