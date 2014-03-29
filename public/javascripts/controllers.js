// require('./Pad.js')

function DrawingAppCtrl($scope, socket, drawingPad) {
  console.log("starting");
  drawingPad.initialize(socket);

  socket.on('draw', function (data) {
    drawingPad.drawLineFrom( data.begin, data.end );
  });

}