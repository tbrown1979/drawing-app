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

  var usernames = {};

  io.sockets.on('connection', function (socket) {
    // socket.on('draw', function(data) {
    //   socket.broadcast.emit('draw', data);
    // });

    socket.on('draw', function(data) {
      socket.broadcast.in(socket.room).emit('draw', data);
    });

    socket.on('msg', function(data) {
      io.sockets.in(socket.room).emit('addMsg', data);
    });

    //need to check if username exists
    socket.on('setUsername', function(data) {
      if (typeof(usernames[data.username]) !== 'undefined') {
        socket.emit('setUsernameStatus', {status: false});
      } else {
      socket.username = data.username;
      usernames[data.username] = true;
      socket.emit('setUsernameStatus', {status: true});
      }
    })

    //need to check if group name exists, if so return true status, if not
    //return false.
    socket.on('joinGroup', function(data) {
      socket.room = data.name;
      socket.join(data.name);
      var message = socket.username + " has joined!";
      socket.broadcast.in(data.name).emit('serverGroupMsg', {msg: message});
      socket.emit('joinGroupStatus', {status: true});
    })

    socket.on('disconnect', function(data) {
      console.log(socket.room);
      delete usernames[socket.username];
      if (typeof socket.room !== 'undefined') {
        var message = socket.username + " has left";
        socket.broadcast.in(socket.room).emit('serverGroupMsg', {msg: message})
      }
    })
  });
}

    

