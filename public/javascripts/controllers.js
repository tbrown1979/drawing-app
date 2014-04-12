// require('./Pad.js')

function DrawingAppCtrl($scope, socket, drawingPad) {
  console.log("starting");
  $socket = socket;
  $scope.message;
  $scope.messages = [];
  $scope.joined = false;


  drawingPad.initialize(socket);

  $scope.sendMsg = function (message) {
    $scope.messages.push(message);
    socket.emit('msg', {msg: message});
  }

  $scope.join = function (groupName) {
    $scope.joined = true;
    socket.emit('joinGroup', {name: groupName});
  }

  // socket.on('joinRoom', function(newRoom) {

  // })

  socket.on('draw', function (data) {
    drawingPad.drawLineFrom( data.begin, data.end );
  });

  socket.on('addMsg', function (data) {
    console.log(data);
    $scope.messages.push(data.msg);
    // console.log($scope.messages);
  });

}