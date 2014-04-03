// require('./Pad.js')

function DrawingAppCtrl($scope, socket, drawingPad) {
  console.log("starting");
  $scope.message;
  $scope.messages = [];
  $scope.joined = false;


  drawingPad.initialize(socket);

  $scope.sendMsg = function (message) {
    console.log($scope.messages);
    $scope.messages.push(message);
    socket.emit('msg', {msg: message});
  }

  $scope.join = function (groupName) {
    $scope.joined = true
    $socket.emit('join', {group: "name"});
  }

  socket.on('draw', function (data) {
    drawingPad.drawLineFrom( data.begin, data.end );
  });

  socket.on('addMsg', function (data) {
    console.log("hit")
    $scope.messages.push(data.msg);
  });

}