// works out the X, Y position of the click inside the canvas from the X, Y position on the page

function DrawingPad(canvasId) {
   this.canvas = document.getElementById(canvasId);
   this.context = this.canvas.getContext("2d");
   this.strokeStyle = 'Black'
   this.context.strokeStyle = this.strokeStyle;
   this.strokeWidth = 3;
   this.prevPosition;
}

DrawingPad.prototype.changeStrokeColor = function (color) {
   this.strokeStyle = color;
   this.context.strokeStyle = this.strokeStyle;
}

DrawingPad.prototype.changeStrokeWidth = function (width) {
   this.strokeWidth = width;
}

DrawingPad.prototype.getPosition = function (mouseEvent) {
   var x, y;
   if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
      x = mouseEvent.pageX;
      y = mouseEvent.pageY;
   } else {
      x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
   }

   return this.positionData(x - this.canvas.offsetLeft, y - this.canvas.offsetTop);
}

DrawingPad.prototype.positionData = function (x, y) {
   return { X: x, Y: y };
}

DrawingPad.prototype.initialize = function () {
   var sigCanvas = this.canvas
   var context = this.context
   var pad = this;
   // This will be defined on a TOUCH device such as iPad or Android, etc.
   var is_touch_device = 'ontouchstart' in document.documentElement;

   if (is_touch_device) {
      // create a drawer which tracks touch movements
      var drawer = {
         isDrawing: false,
         touchstart: function (coors) {
            pad.prevPosition = pad.positionData(coors.X, coors.Y);
            pad.draw(coors);
            this.isDrawing = true;
         },
         touchmove: function (coors) {
            if (this.isDrawing) {
               pad.draw(coors);
            }
         },
         touchend: function (coors) {
            if (this.isDrawing) {
               this.touchmove(coors);
               this.isDrawing = false;
            }
         }
      };

      function draw(event) {
         var coors = pad.positionData(
            event.targetTouches[0].pageX,
            event.targetTouches[0].pageY
         );

         var obj = sigCanvas;

         if (obj.offsetParent) {
            do {
               coors.X -= obj.offsetLeft;
               coors.Y -= obj.offsetTop;
            }
           // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
           // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
            while ((obj = obj.offsetParent) != null);
         }

         drawer[event.type](coors);
      }

      sigCanvas.addEventListener('touchstart', draw, false);
      sigCanvas.addEventListener('touchmove', draw, false);
      // sigCanvas.addEventListener('touchend', draw, false);

      sigCanvas.addEventListener('touchmove', function (event) {
         event.preventDefault();
      }, false); 
   }
   else {
      var drawingPad = this;
      $("#canvasSignature").mousedown(function (mouseEvent) {
         var position = drawingPad.getPosition(mouseEvent);

         drawingPad.prevPosition = position;
         drawingPad.context.beginPath();
         drawingPad.context.moveTo(position.X, position.Y);
         drawingPad.drawOnePixel(mouseEvent);//draw initial pixel

         event.preventDefault();

         $(this).mousemove(function (mouseEvent) {
            drawingPad.eventDraw(mouseEvent);
         }).mouseup(function (mouseEvent) {
            drawingPad.finishDrawing(mouseEvent);
         }).mouseout(function (mouseEvent) {
            drawingPad.eventDraw(mouseEvent);
         }).mouseover(function (mouseEvent) {
            drawingPad.drawUponReenter(mouseEvent);
         })
         //mouse press is released outside of canvas
         $(document).mouseup(function(mouseEvent) {
            drawingPad.finish(mouseEvent);
         });
      });
   }
}

DrawingPad.prototype.drawData = function (begin, end, color) {
   return {
      begin: {X: begin.X, Y: begin.Y},
      end: {X: end.X, Y: end.Y},
      color: color
   };
}

DrawingPad.prototype.draw = function (curPosition) {
   this.context.beginPath();
   this.context.moveTo(this.prevPosition.X, this.prevPosition.Y);
   socket.emit('draw', 
      this.drawData(
         this.positionData(this.prevPosition.X, this.prevPosition.Y),
         this.positionData(curPosition.X, curPosition.Y),
         this.strokeStyle)
   );
   this.context.lineWidth = this.strokeWidth;
   this.context.lineCap = 'round';
   this.prevPosition = curPosition;
   this.context.lineTo(curPosition.X, curPosition.Y);
   this.context.stroke();
   this.context.closePath();
}

DrawingPad.prototype.eventDraw = function (mouseEvent) {
   this.draw(this.getPosition(mouseEvent));
}

DrawingPad.prototype.drawLineFrom = function (begin, end) {
   this.context.beginPath();
   this.context.moveTo(begin.X, begin.Y);
   this.context.lineTo(end.X, end.Y);
   this.context.stroke();
   this.context.closePath();
}

DrawingPad.prototype.drawUponReenter = function (mouseEvent) {
   this.prevPosition = this.getPosition(mouseEvent);
   this.eventDraw(mouseEvent);
}

DrawingPad.prototype.drawOnePixel = function (mouseEvent) {
   this.prevPosition = this.positionData(this.prevPosition.X-1, this.prevPosition.Y);
   this.eventDraw(mouseEvent);
}

DrawingPad.prototype.finish = function(mouseEvent) {
   $(this.canvas).unbind("mousemove")
      .unbind("mouseup")
      .unbind("mouseout")
      .unbind("mouseover");
   $(document).unbind("mouseup");
}

DrawingPad.prototype.finishDrawing = function (mouseEvent) {
   this.eventDraw(mouseEvent);

   this.context.closePath();
   this.finish(mouseEvent);
}

DrawingPad.prototype.setCanvasDimensionsToClient = function () {
   this.canvas.width = document.body.clientWidth;
   this.canvas.height = document.body.clientHeight;
}
