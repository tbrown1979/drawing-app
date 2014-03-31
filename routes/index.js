module.exports = function(io) {
  var routes = {};
  routes.index = function (req, res) {
    require('../public/javascripts/Pad.js');

    io.sockets.on('connection', function (socket) {

      socket.on('draw', function(data) {
        socket.broadcast.emit('draw', data);
      });

      socket.on('my other event', function (data) {
        console.log(data);
      });
    });
    res.render('index', {title: 'Express'});
  }

  routes.pictionary = function (req, res) {
    require('../public/javascripts/Pad.js');

    io.sockets.on('connection', function (socket) {
      socket.on('draw', function(data) {
        socket.broadcast.emit('draw', data);
      })

      socket.on('msg', function(data) {
        socket.broadcast.emit('addMsg', data);
      })
    });


    res.render('pictionary', {title: 'Pictionary'})
  }
  return routes;
};