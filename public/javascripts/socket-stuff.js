var socket = io.connect();
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});


socket.on('draw', function (data) {
    sigCanvas = document.getElementById("canvasSignature");
    context = sigCanvas.getContext("2d");
    context.beginPath();
    context.moveTo(data.initialX, data.initialY);
    context.lineTo(data.endX, data.endY);
    context.strokeStyle = 'Black';
    context.lineWidth="2";
    context.stroke();
    context.closePath();

});