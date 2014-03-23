// works out the X, Y position of the click inside the canvas from the X, Y position on the page

function DrawingPad(canvasId) {
   this.canvas = document.getElementById(canvasId);
   this.context = this.canvas.getContext("2d");
   this.strokeStyle = 'Black';
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

   return { X: x - this.canvas.offsetLeft, Y: y - this.canvas.offsetTop };
}

DrawingPad.prototype.initialize = function () {
   // get references to the canvas element as well as the 2D drawing context
   var sigCanvas = document.getElementById("canvasSignature");
   var context = sigCanvas.getContext("2d");
   context.strokeStyle = 'Black';

   // This will be defined on a TOUCH device such as iPad or Android, etc.
   var is_touch_device = 'ontouchstart' in document.documentElement;

   if (is_touch_device) {
      // create a drawer which tracks touch movements
      var drawer = {
         isDrawing: false,
         touchstart: function (coors) {
            context.beginPath();
            context.moveTo(coors.x, coors.y);
            this.isDrawing = true;
         },
         touchmove: function (coors) {
            if (this.isDrawing) {
               context.lineTo(coors.x, coors.y);
               context.stroke();
            }
         },
         touchend: function (coors) {
            if (this.isDrawing) {
               this.touchmove(coors);
               this.isDrawing = false;
            }
         }
      };

      // create a function to pass touch events and coordinates to drawer
      function draw(event) {
         // get the touch coordinates.  Using the first touch in case of multi-touch
         var coors = {
            x: event.targetTouches[0].pageX,
            y: event.targetTouches[0].pageY
         };
         // Now we need to get the offset of the canvas location
         var obj = sigCanvas;

         if (obj.offsetParent) {
            // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
            do {
               coors.x -= obj.offsetLeft;
               coors.y -= obj.offsetTop;
            }
           // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
           // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
            while ((obj = obj.offsetParent) != null);
         }

         // pass the coordinates to the appropriate handler
         drawer[event.type](coors);
      }

      // attach the touchstart, touchmove, touchend event listeners.
      sigCanvas.addEventListener('touchstart', draw, false);
      sigCanvas.addEventListener('touchmove', draw, false);
      sigCanvas.addEventListener('touchend', draw, false);

      // prevent elastic scrolling
      sigCanvas.addEventListener('touchmove', function (event) {
         event.preventDefault();
      }, false); 
   }
   else {
      // start drawing when the mousedown event fires, and attach handlers to
      // draw a line to wherever the mouse moves to
      var drawingPad = this;
      $("#canvasSignature").mousedown(function (mouseEvent) {
         var position = drawingPad.getPosition(mouseEvent);

         drawingPad.context.moveTo(position.X, position.Y);
         var prevPosition = { x: position.X, y: position.Y };
         drawingPad.context.beginPath();

         drawingPad.drawOnePixel(mouseEvent, sigCanvas, context);
         
         // attach event handlers
         $(this).mousemove(function (mouseEvent) {
            drawingPad.context.moveTo(prevPosition.x, prevPosition.y);
            drawingPad.drawLine(mouseEvent, prevPosition);
            event.preventDefault();
            prevPosition = drawingPad.updatePrevPosition(mouseEvent, sigCanvas);
         }).mouseup(function (mouseEvent) {
            drawingPad.finishDrawing(mouseEvent, prevPosition);
            prevPosition = drawingPad.updatePrevPosition(mouseEvent, sigCanvas);
         }).mouseout(function (mouseEvent) {
            drawingPad.drawUponExitingCanvas(mouseEvent, prevPosition);
            prevPosition = drawingPad.updatePrevPosition(mouseEvent, sigCanvas);
         }).mouseover(function (mouseEvent) {
            drawingPad.drawUponReenter(mouseEvent, prevPosition);
            prevPosition = drawingPad.updatePrevPosition(mouseEvent, sigCanvas);
         })
         //mouse press is released outside of canvas
         $(document).mouseup(function(mouseEvent) {
            drawingPad.finish(mouseEvent);
         });
      });
   }
}

DrawingPad.prototype.updatePrevPosition = function (mouseEvent) {
   var position = this.getPosition(mouseEvent);

   return { x: position.X, y: position.Y };
}

DrawingPad.prototype.finish = function (mouseEvent) {
   this.context.closePath();

   $(this.canvas).unbind("mousemove")
      .unbind("mouseup")
      .unbind("mouseout")
      .unbind("mouseover");
   $(document).unbind("mouseup");
}

DrawingPad.prototype.drawUponReenter = function (mouseEvent, prevPosition) {
   var position = this.getPosition(mouseEvent);

   this.context.moveTo(position.X, position.Y);
   this.drawLine(mouseEvent, sigCanvas, context, prevPosition);
}

DrawingPad.prototype.drawUponExitingCanvas = function (mouseEvent, prevPosition) {
   this.drawLine(mouseEvent, prevPosition);
}

DrawingPad.prototype.drawLine = function (mouseEvent, prevPosition) {
   var position = this.getPosition(mouseEvent);
   socket.emit('draw', {initialX: prevPosition.x,
                        initialY: prevPosition.y,
                        endX: position.X,
                        endY: position.Y});
   this.context.lineTo(position.X, position.Y);
   this.context.stroke();
}

DrawingPad.prototype.drawOnePixel = function (mouseEvent, prevPosition) {
   var position = this.getPosition(mouseEvent);

   this.context.lineTo(position.X-1, position.Y);
   this.context.stroke();
}

DrawingPad.prototype.finishDrawing = function (mouseEvent, prevPosition) {
   this.drawLine(mouseEvent, prevPosition);

   this.finish(mouseEvent);
}
