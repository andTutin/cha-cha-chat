import '../../node_modules/normalize.css'
import '../css/chat.css';
import findCookie from './modules/check-cookie';
import setCookie from './modules/set-cookie';
const io = require('socket.io-client');
const sessionTime = 600;
let socket = io.connect('http://localhost:3000');

const messageForm = document.querySelector('.message-form'),
      sendButton = document.querySelector('.send-button'),
      messagesWindow = document.querySelector('.messages-window'),
      overlay = document.querySelector('.overlay'),
      authForm = document.querySelector('.auth__form'),
      clientsOnline = document.querySelector('.users__list');

document.addEventListener('DOMContentLoaded', () => {
    let isUserLogged = findCookie(document.cookie, 'logged')

    if (!isUserLogged) {
        overlay.classList.add('open');
        
        authForm.addEventListener('submit', e => {
            e.preventDefault();
            setCookie('logged', authForm.fio.value, sessionTime);
            overlay.classList.remove('open');

            socket.emit('login', {
                fio:  authForm.fio.value,
                nickname: authForm.nickname.value,
                photo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXGxsb////JycnDw8Pv7+/8/Pza2trNzc3g4ODy8vLm5ub4+PjV1dXj4+Pr6+vp6ekuEkSCAAADOElEQVR4nO3cW3OrIBSGYXSpeIr+/3+7RZumnaSpix2Di75PLzqdyQVfOQgIcQ4AAAAAAAAAAAAAAAAAAAAAAAA4Tpm6AEeTq9QFOYRIOTZtX1XTpR29yy2kiG+7urgZpjGnkOKarrhTzz6XjNIMa6L7kFMWGcU/qL/PerxsnzE7xi41JO2DuvuiM1+N89N8oRpHyxHFPWmhnxqrEUPf2hPQbkRxUu0KaDZiKfPDR8QjPnVho0izswYXQ+rCRil31t9qNthOZVIELIoxdXn1RlXAYjBXibvHUauVKF4ZsOiMVaKyFwbWJqiagXTT20qoHGcCW2ON9PqEhalFogwRCZvUpVbRd0NjHdHHJKwsJYwYaIwNNYplxU1tKKFm4UTCc/oDCbMfafQri8DU0yL/J37crM1Uwuxn3jGTGktD6UL0CS/GEv76zumOtV0Mv3dD/8raTlT+u4nqaU2XusB62l19a43UKdf5k8GAqgVGbfP40P52WpsbZlay9zW+sRnpTZhm7puAtzYDbvZENB3QuV8f/LXRJroJDbV9Em75GcIxDMsZF/5ZS+1Tl+4lpB3uD9asf1fW1hM/EdcM9/nqPE6XfhDxl28Px7pqSsns6L5I6Zt+mqpp7jM8yf5BxOV7GeGvyKvjAQCAh+Tbr8zI7YpsHlPTLwnWPH5s+7nq6mAYumoOV2VNJ90moEuAcmynH7dN625ufOk+c9qatoabzW21YzdxjemM1ebS+pZ0u97M1Nunhn5Z85sJKW6cYs7TdK3fQp64sa5dKi7eZriGPKuw4RRzVmiz/WO6sEV1UiKPrt1HJO23bcazBb3fFP0PYav4bFfY5YX5rhnPRMbX5itCWz1RM5Xfb91HZRzPMq4eUIEfpnMMq3I5KN9iOENvjLhpqJD6OyVCI9KeX9MKEVM+N6TSnkFUqhMfRYk67azNmPQLF6LuVWil/MIF1dcmxEt3TeHI58Q3ydrpm6qwTlaJcfe3YhKm6onqo9zxUp3OPGo6ei/R4b43dcMgUUcs3xYw1cW9/BO67BPmX4ckJCEJSUhCEpKQhC+V6hp0+T6nfrkPAAAAAAAAAAAAAAAAAAAAAAAAvNc/BaMjNJZwCScAAAAASUVORK5CYII'
            })
        })
    }
})

socket.on('chat-message', (data) => {
    messagesWindow.innerHTML += 
        `<div class="message">
            <div class="message__photo">
                <div class="white"></div>
            </div>
            <div class="message__body">
                <div class="message__text"> ${data.message}</div>
                <div class="message__time"> ${data.time}</div>
                <div class="message__arrow">
                    <div></div>
                </div>
            </div>
        </div>`;

    messagesWindow.scrollTop = 1000000000
})

socket.on('clients-online', (data) => {
    clientsOnline.innerHTML = '';
    data.forEach(client => {
        clientsOnline.innerHTML += 
           `<li class="users__item">
                <div class="user-card">
                    <div class="user-card__avatar">
                        <img src="${client.photo}">
                    </div>
                    <div class="user-card__info">
                        <div class="user-card__username">${client.fio}</div>
                        <div class="user-card__nickname">${client.nickname}</div>
                </div>
                </div>
            </li>`;
    })
})

socket.on('messages-history', (data) => {
    console.log(data)
    data.forEach(message => {
        messagesWindow.innerHTML += 
            `<div class="message">
                <div class="message__photo">
                    <div class="white"></div>
                </div>
                <div class="message__body">
                    <div class="message__text"> ${message.message}</div>
                    <div class="message__time"> ${message.time}</div>
                    <div class="message__arrow">
                        <div></div>
                    </div>
                </div>
            </div>`;
    })

    messagesWindow.scrollTop = 1000000000
})

socket.on('clients-counter', data => {
    console.log(data)
    if (data == 1) {
        document.querySelector('.users-counter__value p').innerText = '1 участник'
    } else {
        document.querySelector('.users-counter__value p').innerText = data + 'участникa(-ов)'
    }       
})

sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('chat-message', {
        message: messageForm.message.value,
        time: new Date().toLocaleTimeString()
    })

    messageForm.message.value = ''
})

