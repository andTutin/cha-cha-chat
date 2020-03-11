import '../../node_modules/normalize.css'
import '../css/chat.css';
import render from './modules/render';
import User from './modules/user';
import overlay from './modules/overlay';
import queries from './modules/queries';

const io = require('socket.io-client');
let socket = io.connect('http://localhost:3000');
let client;

document.addEventListener('DOMContentLoaded', () => {
    overlay.openAuth();
    const authForm = document.querySelector('.auth__form');

    authForm.addEventListener('submit', e => {
        e.preventDefault();
        client = new User(socket.id, authForm.fio.value, authForm.nickname.value);
        socket.emit('login', client)
        overlay.close();
    })   
})

queries.hamburger.addEventListener('click', () => {
    overlay.openUser(client);
    overlay.closeOnClick();

    const photoInput = document.querySelector('#photo-input')
    const fileReader = new FileReader();
    
    fileReader.addEventListener('load', () => {
        document.querySelector('.confirmation').style.display = 'flex';
        document.querySelector('#new-avatar__preview').src = fileReader.result;
        document.querySelector('#input-img').src = fileReader.result;
        document.querySelector('#reset-btn').addEventListener('click', () => {
            overlay.close()
        })
    })

    photoInput.addEventListener('change', e => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 30 * 1024) {
                alert('Размер файла не должен превышать 30КБ')
            } else {
                fileReader.readAsDataURL(file);
            }
        }
    })

    document.querySelector('#submit-btn').addEventListener('click', () => {
        console.log(document.querySelectorAll('.' + socket.id))
        document.querySelectorAll('.' + socket.id).forEach(pic => pic.src = fileReader.result);
        client.avatar = fileReader.result;
        socket.emit('change-avatar', client);
        overlay.close(); 
    })
})

queries.sendButton.addEventListener('click', e => {
    e.preventDefault();

    client.message = queries.messageForm.message.value;
    client.time = new Date().toLocaleTimeString();

    socket.emit('chat-message', client)

    queries.messagesWindow.innerHTML += render.message(client)

    let newMessage = document.querySelector('.message:last-of-type');

    newMessage.classList.add('my');

    groupMessages(socket.id);

    queries.messageForm.message.value = '';

    queries.messagesWindow.scrollTop = 1000000000
})

socket.on('clients-online', data => {
    queries.clientsOnline.innerHTML = render.client(client);
    for (let client of data) queries.clientsOnline.innerHTML += render.client(client); 
})

socket.on('messages-history', data => {
    data.forEach(message => {
        queries.messagesWindow.innerHTML += render.message(message);

        let newMessage = document.querySelector('.message:last-of-type');
        
        groupMessages(newMessage.querySelector('img').className);  
    })
    

    queries.messagesWindow.scrollTop = 1000000000
})

socket.on('clients-counter', data => {
    if (data == 1) {
        queries.userCounter.innerText = '1 участник'
    } else {
        queries.userCounter.innerText = data + ' участникa (-ов)'
    }       
})

socket.on('login', data => {
    queries.clientsOnline.innerHTML += render.client(data);
})

socket.on('user-joined', data => {
    queries.messagesWindow.innerHTML += `<div style="width: 100%; text-align: center; margin-bottom: 20px;"> ${data} </div>`;
    queries.messagesWindow.scrollTop = 1000000000
})

socket.on('chat-message', data => {
    queries.messagesWindow.innerHTML += render.message(data)

    let newMessage = document.querySelector('.message:last-of-type');
        
    groupMessages(newMessage.querySelector('img').className);

    queries.messagesWindow.scrollTop = 1000000000
})

socket.on('change-avatar', data => {
    document.querySelectorAll('.' + data.id).forEach(pic => pic.src = data.avatar)
})

socket.on('disconnect', data => {

    if (document.getElementById(data)) {
        queries.messagesWindow.innerHTML += `<div style="width: 100%; text-align: center; margin-bottom: 20px;"> ${document.getElementById(data).querySelector('.user-card__username').textContent} покинул чат </div>`;
        queries.messagesWindow.scrollTop = 1000000000
        document.getElementById(data).remove()
    } 


})

function groupMessages(nameOfClass) {
    let newMessage = document.querySelector('.message:last-of-type');
    let prevMessage = newMessage.previousSibling;

    if (prevMessage) {
        if (prevMessage.querySelector('img').className == nameOfClass) { 
            newMessage.querySelector('.message__photo').style.visibility = 'hidden';
            newMessage.querySelector('.message__arrow').style.visibility = 'hidden';
        }
    }    
}