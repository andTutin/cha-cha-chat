const express = require('express'),
      socket = require('socket.io'),
      app = express(),
      PORT = 3000,
      server = app.listen(PORT);

app.use(express.static('dist'));

module.exports = socket(server);
