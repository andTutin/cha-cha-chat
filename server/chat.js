const io = require('./modules/server'),
      store = require('./modules/store');

io.on('connection', socket => {
    socket.on('login', data => {
        socket.emit('clients-online', store.mapState('users'));
        socket.broadcast.emit('login', data);
        socket.emit('messages-history', store.mapState('history'));
        store.mapActions().addUser(data);
        io.sockets.emit('clients-counter', store.mapState('users').length);
        io.sockets.emit('user-joined', data);    
    })

    socket.on('chat-message', data => {
        store.mapActions().addMessage(data);
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('change-avatar', data => {
        store.mapActions().changeAvatar(data);
        socket.broadcast.emit('change-avatar', data)
    })
    
    socket.on('disconnect', () => {
        store.mapActions().deleteUser(socket.id);
        io.sockets.emit('disconnect', store.getUser(socket.id))
    });

})
