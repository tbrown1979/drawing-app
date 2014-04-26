// require('./Pad.js')

function DrawingAppCtrl($scope, socket, drawingPad) {
  console.log("starting");
  $socket = socket;
  $scope.message;
  $scope.messages = [];
  $scope.joined = false;
  $scope.username;


  drawingPad.initialize(socket);

  $scope.sendMsg = function (message) {
    $scope.messages.push(message);
    $scope.message = "";
    socket.emit('msg', {msg: message, name: $scope.username});
  }

  $scope.join = function (groupName) {
    $scope.joined = true;
    socket.emit('joinGroup', {name: groupName});
  }

  $scope.chooseUsername = function (name) {
    console.log("stuff");
    $scope.username = name;
    socket.emit('setUsername', {username: name});
  }

  // socket.on('joinRoom', function(newRoom) {

  // })

  socket.on('draw', function (data) {
    drawingPad.drawLineFrom( data.begin, data.end );
  });

  socket.on('addMsg', function (data) {
    console.log(data);
    $scope.messages.push(data);
  });

}