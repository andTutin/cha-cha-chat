let express = require('express');
let socket = require('socket.io');
let app = express();
const PORT = 3000;
let server = app.listen(PORT, function() {
    console.log(`listening on port ${PORT}`)
});

app.use(express.static('dist'));

var io = socket(server);

io.on('connection', function(socket){
    console.log('made connection')
})