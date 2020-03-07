import '../../node_modules/normalize.css'
import '../css/chat.css';
import findCookie from './modules/check-cookie';
import setCookie from './modules/set-cookie';
const io = require('socket.io-client');
const pug = require('pug');
const sessionTime = 60;

let socket = io.connect('http://localhost:3000');

const messageForm = document.querySelector('.message-form'),
      sendButton = document.querySelector('.send-button'),
      messagesWindow = document.querySelector('.messages-window'),
      overlay = document.querySelector('.overlay'),
      authForm = document.querySelector('.auth__form');

document.addEventListener('DOMContentLoaded', () => {
    let isUserLogged = findCookie(document.cookie, 'logged')

    if (!isUserLogged) {
        overlay.classList.add('open');
        let fn = pug.compileFile('../templates/blocks/auth');
        let html = fn()
        overlay.innerHTML = html

        authForm.addEventListener('submit', e => {
            e.preventDefault();
            setCookie('logged', authForm.fio.value, sessionTime);
            overlay.classList.remove('open');
        })
    }
})

sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('chat-message', {
        message:  messageForm.message.value,
        time: new Date().toLocaleTimeString()
    })
})

socket.on('chat-message', (data) => {
    messagesWindow.innerHTML += '<div>' +  data.message +  data.time + '</div>';
})

