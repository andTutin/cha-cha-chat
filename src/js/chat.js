import '../css/chat.css';

const io = require('socket.io-client');
let socket = io.connect('http://localhost:3000');