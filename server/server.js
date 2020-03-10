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
    console.log('connected', clients)

    socket.on('login', data => {                                /* слушаем событие login и когда пользователь вошел */
        socket.emit('clients-online', clients)                  /* отправляем ему массив клиентов онлайн */
        socket.broadcast.emit('login', data)                    /* отправляем сообщение всем сокетам, кроме него, сообщение об этом */
        socket.emit('messages-history', messagesHistory)        /* отправляем ему историю сообщений */
        clients.push(data)                                      /* добавляем клиента в массив клиентов он-лайн */
        io.sockets.emit('clients-counter', clients.length);     /* отправляем всем количество пользователей в сети */           
    })

    socket.on('chat-message', data => {
        messagesHistory.push(data);
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('change-avatar', data => {
        clients.forEach(client => {
            if (client.id == data.id) client.avatar = data.avatar
        })
        messagesHistory.forEach(message => {
            if (message.id == data.id) message.avatar = data.avatar
        })
        socket.broadcast.emit('change-avatar', data)
    })

    /* 
    socket.on('disconnect', data => {
        socket.broadcast.emit('disconnect', data);
        /*
        let ind;
        clients.forEach((client, index) => {
            if (client.id == data) ind = index;
        })
        clients.splice(ind, 1)
        console.log('disconnected', clients)
     
    });
    */

})
