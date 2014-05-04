module.exports = function(server) {
  var io = require('socket.io').listen(server);
  //socket.io
  io.configure('production', function(){
    io.enable('browser client minification');  // send minified client
    io.enable('browser client etag');          // apply etag caching logic based on version number
    io.enable('browser client gzip');          // gzip the file
    io.set('log level', 1);                    // reduce logging
    io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
  });

  require('./public/javascripts/Pad.js');

  io.sockets.on('connection', function (socket) {

    // socket.on('draw', function(data) {
    //   socket.broadcast.emit('draw', data);
    // });

    // socket.on('my other event', function (data) {
    //   console.log(data);
    // });

    socket.on('draw', function(data) {
      socket.broadcast.in(socket.room).emit('draw', data);
    });

    socket.on('msg', function(data) {
      io.sockets.in(socket.room).emit('addMsg', data);
    });

    socket.on('setUsername', function(data) {
      socket.username = data.username;
    })

    socket.on('joinGroup', function(data) {
      // socket.username = "bleh";
      socket.room = data.name;
      socket.join(data.name);
      var message = socket.username + " has joined!";
      socket.broadcast.in(data.name).emit('serverGroupMsg', {msg: message});
    })

    socket.on('disconnect', function(data) {
      console.log(socket.username);
      var message = socket.username + " has left";
      socket.broadcast.in(socket.room).emit('serverGroupMsg', {msg: message})
    })
  });
}

    

