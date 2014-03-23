var drawingPad = new DrawingPad("canvasSignature");
drawingPad.initialize();

var socket = io.connect();

socket.on('draw', function (data) {
    drawingPad.drawLineFrom(
        drawingPad.positionData(data.initialX, data.initialY),
        drawingPad.positionData(data.endX, data.endY)
    );
});
