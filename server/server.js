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

io.on('connection', socket => {

    socket.on('login', data => {
        socket.emit('clients-online', clients);
        socket.broadcast.emit('login', data);
        socket.emit('messages-history', messagesHistory);
        clients.push(data);
        io.sockets.emit('clients-counter', clients.length);
        io.sockets.emit('user-joined', `${data.fio} присоединился (-лась) к чату`);      
    })

    socket.on('chat-message', data => {
        messagesHistory.push(data);
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('change-avatar', data => {
        clients.forEach(client => {
            if (client.socketID == data.socketID) client.avatar = data.avatar
        })
        messagesHistory.forEach(message => {
            if (message.socketID == data.socketID) message.avatar = data.avatar
        })
        socket.broadcast.emit('change-avatar', data)
    })

    socket.on('disconnect', () => {
        let ind;

        clients.forEach((client, index) => {
            if (client.socketID == socket.id) {
                ind = index;
                io.sockets.emit('disconnect', client)
            }
        })

        clients.splice(ind, 1)
    });
})
