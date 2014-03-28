// require('./Pad.js')

function DrawingAppCtrl($scope, socket, drawingPad) {
  console.log("starting");
  drawingPad.initialize(socket);

  socket.on('draw', function (data) {
    $scope.drawingPad.drawLineFrom( data.begin, data.end );
  });

}