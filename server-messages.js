module.exports = function(server) {
  var io = require('socket.io').listen(server);
  //socket.io
  io.configure('production', function(){
    io.enable('browser client minification');  // send minified client
    io.enable('browser client etag');          // apply etag caching logic based on version number
    io.enable('browser client gzip');          // gzip the file
    io.set('log level', 1);                    // reduce logging
    // enable all transports (optional if you want flashsocket)
    io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
  });

  require('./public/javascripts/Pad.js');

  io.sockets.on('connection', function (socket) {

    socket.on('draw', function(data) {
      socket.broadcast.emit('draw', data);
    });

    socket.on('my other event', function (data) {
      console.log(data);
    });

    socket.on('draw', function(data) {
      socket.broadcast.emit('draw', data);
    });

    socket.on('msg', function(data) {
      socket.broadcast.emit('addMsg', data);
    });
  });
}

    
