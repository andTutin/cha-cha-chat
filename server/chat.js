const io = require('./modules/server'),
      store = require('./modules/store');

io.on('connection', socket => {
    socket.on('login', data => {
        socket.emit('clients-online', store.mapState('users'));
        socket.broadcast.emit('login', data);
        socket.emit('messages-history', store.mapState('history'));
        store.mapActions().addUser(data);
        io.sockets.emit('clients-counter', store.mapState('users').length);
        io.sockets.emit('user-joined', `${data.fio} присоединился (-лась) к чату`);    
    })

    socket.on('chat-message', data => {
        store.mapActions().addMessage(data);
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('change-avatar', data => {
        store.mapActions().changeAvatar(data);
        socket.broadcast.emit('change-avatar', data)
    })
    
    /*
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
    */
})
