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
            fileReader.readAsDataURL(file)
        }
    })

    document.querySelector('#submit-btn').addEventListener('click', () => {
        let attr = `[data-image=${socket.id}]`;

        document.querySelectorAll(attr).forEach(pic => pic.src = fileReader.result);
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

    document.querySelector('.message:last-of-type').classList.add('my')

    queries.messageForm.message.value = ''
})

socket.on('clients-online', data => {
    queries.clientsOnline.innerHTML = render.client(client);
    for (let client of data) queries.clientsOnline.innerHTML += render.client(client); 
})

socket.on('messages-history', data => {
    data.forEach(message => {
        queries.messagesWindow.innerHTML += render.message(message)
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

socket.on('chat-message', data => {
    queries.messagesWindow.innerHTML += render.message(data)
    queries.messagesWindow.scrollTop = 1000000000
})

socket.on('change-avatar', data => {
    let attr = `[data-image=${data.id}]`;
    document.querySelectorAll(attr).forEach(pic => pic.src = data.avatar)
})



/*


socket.on('disconnect', data => {
    let attr = `[data-user=${data}]`;
    document.querySelector(attr).remove()
})
*/
