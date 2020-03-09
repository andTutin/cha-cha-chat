let express = require('express');
let socket = require('socket.io');
let app = express();
const PORT = 3000;
let server = app.listen(PORT, function() {
    console.log(`listening on port ${PORT}`)
});
let io = socket(server);
let clients = [];
let messagesHistory = [];

app.use(express.static('dist'));

io.on('connection', function(socket) {
    console.log('connected')

    socket.on('login', (data) => {
        clients.push(data)
        io.sockets.emit('clients-online', clients)
        io.sockets.emit('messages-history', messagesHistory)
        io.sockets.emit('clients-counter', clients.length);        
    })

    socket.on('disconnect', () => console.log('disconnect'))

    socket.on('chat-message', (data) => {
        messagesHistory.push(data);
        io.sockets.emit('chat-message', data)
    })
})

//io.on('disconnect', () => console.log('disconnect'));