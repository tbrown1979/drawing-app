var drawingPad = new DrawingPad("canvasSignature");
drawingPad.initialize();
drawingPad.setCanvasDimensionsToClient();

var socket = io.connect();

socket.on('draw', function (data) {
    drawingPad.drawLineFrom( data.begin, data.end );
});

$(window).resize( function () {
    drawingPad.setCanvasDimensionsToClient();
});

$('button[type=button]').click(function(){
    drawingPad.changeStrokeColor(this.value);
});

$('input[type=range]').change(function(){
    drawingPad.changeStrokeWidth(this.value);
});