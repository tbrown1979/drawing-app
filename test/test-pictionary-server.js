var should = require('should');

var io = require('socket.io-client');

var socketURL = 'http://localhost:8000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var socketStuff = require('../server-messages.js')(8000);

var chatUser1 = {'name':'Tom'};
var chatUser2 = {'name':'Sally'};
var chatUser3 = {'name':'Dana'};

var msg1 = "Hello there"


describe("Chat Server",function(){

  /* Test 1 - A Single User */
  it('Should broadcast new user once they connect',function(done){
    var client = io.connect(socketURL, options);
    client.on('connect', function(data){
      console.log("emitting");
      client.emit('msg',{msg: msg1});
    });

    client.on('addMsg',function(data){
      console.log("MADE IT!");
      data.msg.should.equal(msg1);
      /* If this client doesn't disconnect it will interfere 
      with the next test */
      client.disconnect();
      done(); 
    });
  });

})
