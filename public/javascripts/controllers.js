// require('./Pad.js')

function DrawingAppCtrl($scope, socket, drawingPad) {
  console.log("starting");
  $scope.message;
  $scope.messages = [];


  drawingPad.initialize(socket);

  $scope.sendMsg = function (message) {
    console.log($scope.messages);
    $scope.messages.push(message);
    socket.emit('msg', {msg: message});
  }

  socket.on('draw', function (data) {
    drawingPad.drawLineFrom( data.begin, data.end );
  });

  socket.on('receiveMsg', function (data) {
    $scope.messages.push(data.msg);
  });

}