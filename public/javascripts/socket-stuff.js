var drawingPad = new DrawingPad("canvasSignature");
drawingPad.initialize();

var socket = io.connect();

socket.on('draw', function (data) {
    drawingPad.drawLineFrom( data.begin, data.end );
});
