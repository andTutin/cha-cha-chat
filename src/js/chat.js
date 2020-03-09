import '../../node_modules/normalize.css'
import '../css/chat.css';

import storage from './modules/storage';
import cookie from './modules/cookie';
import render from './modules/render';

const io = require('socket.io-client');
const sessionTime = 600;
let socket = io.connect('http://localhost:3000');
const DEFAULTPHOTO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXGxsb////JycnDw8Pv7+/8/Pza2trNzc3g4ODy8vLm5ub4+PjV1dXj4+Pr6+vp6ekuEkSCAAADOElEQVR4nO3cW3OrIBSGYXSpeIr+/3+7RZumnaSpix2Di75PLzqdyQVfOQgIcQ4AAAAAAAAAAAAAAAAAAAAAAAA4Tpm6AEeTq9QFOYRIOTZtX1XTpR29yy2kiG+7urgZpjGnkOKarrhTzz6XjNIMa6L7kFMWGcU/qL/PerxsnzE7xi41JO2DuvuiM1+N89N8oRpHyxHFPWmhnxqrEUPf2hPQbkRxUu0KaDZiKfPDR8QjPnVho0izswYXQ+rCRil31t9qNthOZVIELIoxdXn1RlXAYjBXibvHUauVKF4ZsOiMVaKyFwbWJqiagXTT20qoHGcCW2ON9PqEhalFogwRCZvUpVbRd0NjHdHHJKwsJYwYaIwNNYplxU1tKKFm4UTCc/oDCbMfafQri8DU0yL/J37crM1Uwuxn3jGTGktD6UL0CS/GEv76zumOtV0Mv3dD/8raTlT+u4nqaU2XusB62l19a43UKdf5k8GAqgVGbfP40P52WpsbZlay9zW+sRnpTZhm7puAtzYDbvZENB3QuV8f/LXRJroJDbV9Em75GcIxDMsZF/5ZS+1Tl+4lpB3uD9asf1fW1hM/EdcM9/nqPE6XfhDxl28Px7pqSsns6L5I6Zt+mqpp7jM8yf5BxOV7GeGvyKvjAQCAh+Tbr8zI7YpsHlPTLwnWPH5s+7nq6mAYumoOV2VNJ90moEuAcmynH7dN625ufOk+c9qatoabzW21YzdxjemM1ebS+pZ0u97M1Nunhn5Z85sJKW6cYs7TdK3fQp64sa5dKi7eZriGPKuw4RRzVmiz/WO6sEV1UiKPrt1HJO23bcazBb3fFP0PYav4bFfY5YX5rhnPRMbX5itCWz1RM5Xfb91HZRzPMq4eUIEfpnMMq3I5KN9iOENvjLhpqJD6OyVCI9KeX9MKEVM+N6TSnkFUqhMfRYk67azNmPQLF6LuVWil/MIF1dcmxEt3TeHI58Q3ydrpm6qwTlaJcfe3YhKm6onqo9zxUp3OPGo6ei/R4b43dcMgUUcs3xYw1cW9/BO67BPmX4ckJCEJSUhCEpKQhC+V6hp0+T6nfrkPAAAAAAAAAAAAAAAAAAAAAAAAvNc/BaMjNJZwCScAAAAASUVORK5CYII';

const messageForm = document.querySelector('.message-form'),
      sendButton = document.querySelector('.send-button'),
      messagesWindow = document.querySelector('.messages-window'),
      overlay = document.querySelector('.overlay'),
      clientsOnline = document.querySelector('.users__list'),
      hamburger = document.querySelector('.hamburger');

document.addEventListener('DOMContentLoaded', () => {
    //let isUserLogged = cookie.get('logged')

    //if (!isUserLogged) {
        overlay.classList.add('open');
        overlay.innerHTML = render.auth();
        const authForm =document.querySelector('.auth__form');

        if (authForm) {
            authForm.addEventListener('submit', e => {
                e.preventDefault();

                //cookie.set('logged', true, sessionTime);
                storage.set(authForm.fio.value, authForm.nickname.value);
                
                socket.emit('login', {
                    id: socket.id,
                    fio:  authForm.fio.value,
                    nickname: authForm.nickname.value,
                    photo: storage.get().avatar || DEFAULTPHOTO
                })
                
                overlay.innerHTML = '';
                overlay.classList.remove('open');
            })
        }
    //}
})

hamburger.addEventListener('click', () => {
    overlay.classList.add('open');
    overlay.innerHTML = render.user(storage.get());

    const photoInput = document.querySelector('#photo-input')
    const fileReader = new FileReader();
    
    fileReader.addEventListener('load', () => {
        document.querySelector('.confirmation').style.display = 'flex';
        document.querySelector('#new-avatar__preview').src = fileReader.result;
        document.querySelector('#input-img').src = fileReader.result;
    })

    photoInput.addEventListener('change', e => {
        const file = e.target.files[0];

        if (file) {
            fileReader.readAsDataURL(file)
        }
    })

    document.querySelector('#submit-btn').addEventListener('click', () => {
        let name = storage.get().fio;
        let nick = storage.get().nickname;
        let imgClass = `.${socket.id}`;
        console.log('selector', typeof imgClass, imgClass)
        document.querySelectorAll(imgClass).forEach(pic => pic.src = fileReader.result)
        storage.set(name, nick, fileReader.result);

        socket.emit('change-avatar', {
            id: socket.id,
            avatar: fileReader.result
        })

        overlay.classList.remove('open'); 
    })
})

socket.on('change-avatar', data => {
    let imgClass = `.${data.id}`;
    document.querySelectorAll(imgClass).forEach(pic => pic.src = data.avatar)
})

socket.on('chat-message', data => {
    messagesWindow.innerHTML += render.message(data)
    messagesWindow.scrollTop = 1000000000
})

socket.on('clients-online', data => {
    clientsOnline.innerHTML = '';
    for (let client of data) clientsOnline.innerHTML += render.client(client);
})

socket.once('messages-history', data => {
    data.forEach(message => {
        messagesWindow.innerHTML += render.message(message)
    })

    messagesWindow.scrollTop = 1000000000
})

socket.on('clients-counter', data => {
    if (data == 1) {
        document.querySelector('.users-counter__value p').innerText = '1 участник'
    } else {
        document.querySelector('.users-counter__value p').innerText = data + 'участникa(-ов)'
    }       
})

sendButton.addEventListener('click', (e) => {
    e.preventDefault();

    socket.emit('chat-message', {
        id: socket.id,
        fio: storage.get().fio,
        photo: storage.get().avatar,
        message: messageForm.message.value,
        time: new Date().toLocaleTimeString()
    })

    messagesWindow.innerHTML += render.message({
        id: socket.id,
        fio: storage.get().fio,
        photo: storage.get().avatar,
        message: messageForm.message.value,
        time: new Date().toLocaleTimeString()
    })

    document.querySelector('.message:last-of-type').style.marginLeft = 'auto';
    document.querySelector('.message:last-of-type').style.flexDirection = 'row-reverse';

    messageForm.message.value = ''
})

