import '../../node_modules/normalize.css'
import '../css/chat.css';
import render from './modules/render';
import User from './modules/user';
import overlay from './modules/overlay';
import queries from './modules/queries';

const io = require('socket.io-client');
let socket = io();
let userID;
let userClass;
let socketID;
let client;

document.addEventListener('DOMContentLoaded', () => {
    overlay.openAuth();
    const authForm = document.querySelector('.auth__form');

    authForm.addEventListener('submit', e => {
        e.preventDefault();
        socketID = socket.id;
        userID = 'user' + socket.id;
        userClass = '.user' + socket.id
        client = new User(socketID, userID, userClass, authForm.fio.value, authForm.nickname.value);
        socket.emit('login', client);
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
        document.querySelectorAll(userClass).forEach(pic => pic.src = fileReader.result);
        client.avatar = fileReader.result;
        socket.emit('change-avatar', client);
        overlay.close(); 
    })
})

queries.messageForm.addEventListener('submit', e => {
    e.preventDefault();

    client.message = queries.messageForm.message.value;
    client.time = new Date().toLocaleTimeString();

    socket.emit('chat-message', client)

    queries.messagesWindow.innerHTML += render.message(client)

    let newMessage = document.querySelector('.message:last-of-type');

    newMessage.classList.add('my');

    groupMessages(`message message${userID} my`);

    queries.messageForm.message.value = '';

    queries.messagesWindow.scrollTop = 1000000000
})

socket.on('clients-online', data => {
    queries.clientsOnline.innerHTML = render.client(client);

    if (data.length) {
        for (let client of data) queries.clientsOnline.innerHTML += render.client(client);
    }

    queries.messagesWindow.scrollTop = 1000000000
     
})

socket.on('messages-history', data => {
    data.forEach(message => {
        queries.messagesWindow.innerHTML += render.message(message);
        
        groupMessages(`message message${message.userID}`);  
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
        
    groupMessages(`message ${data.userID}`);

    queries.messagesWindow.scrollTop = 1000000000
})

socket.on('change-avatar', data => {
    document.querySelectorAll(data.userClass).forEach(pic => pic.src = data.avatar)
})

socket.on('disconnect', data => {

    if (document.getElementById(data.userID)) {
        queries.messagesWindow.innerHTML += `<div style="width: 100%; text-align: center; margin-bottom: 20px;"> ${data.fio} покинул чат </div>`;
        queries.messagesWindow.scrollTop = 1000000000
        document.getElementById(data.userID).remove()
    }

    queries.messagesWindow.scrollTop = 1000000000
})

function groupMessages(nameOfClass) {
    let newMessage = document.querySelector('.message:last-of-type');
    let prevMessage = newMessage.previousSibling;
    let photo = newMessage.querySelector('.message__photo');
    let arrow = newMessage.querySelector('.message__arrow')

    if (prevMessage) {
        if (prevMessage.className == nameOfClass) { 
            photo.style.visibility = 'hidden';
            arrow.style.visibility = 'hidden';
        }
    }    
}