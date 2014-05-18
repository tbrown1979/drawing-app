// require('./Pad.js')

function DrawingAppCtrl($scope, socket, drawingPad) {
  console.log("starting");
  $socket = socket;
  $scope.message;
  $scope.messages = [];
  $scope.joined = false;
  $scope.username;


  drawingPad.initialize(socket);

  $scope.sendMsg = function (message) {
    // $scope.messages.push({msg: message, name: $scope.username});
    $scope.message = "";
    socket.emit('msg', {msg: message, 
                        username: $scope.username,
                        separator: ":"});
  }

  $scope.join = function (groupName) {
    $scope.joined = true;
    socket.emit('joinGroup', {name: groupName});
  }

  $scope.chooseUsername = function (name) {
    console.log("username chosen");
    socket.emit('setUsername', {username: name});
  }

  // socket.on('joinRoom', function(newRoom) {

  // })

  socket.on('setUsernameStatus', function(data) {
    if (data.status === true) {
      $scope.username = data.name;
    } else {
      console.log($scope.username);
      $scope.username = "";
    }
  })

  socket.on('draw', function (data) {
    drawingPad.drawLineFrom( data.begin, data.end );
  });

  socket.on('addMsg', function (data) {
    console.log(data);
    $scope.messages.push(data);
  });

  socket.on('serverGroupMsg', function (data) {
    $scope.messages.push(data);
  });

  socket.on('disconnect', function(data){
    //nothing here yet;
  })

}