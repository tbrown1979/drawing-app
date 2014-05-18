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
  it('Should broadcast new user once they connect',function(done){
    var client = io.connect(socketURL, options);
    client.on('connect', function(data){
      client.emit('msg',{msg: msg1});
    });

    client.on('addMsg',function(data){
      data.msg.should.equal(msg1);
      client.disconnect();
      done(); 
    });
  })

  it('Should allow user to set their username', function(done){
    var client = io.connect(socketURL, options);
    client.on('connect', function(data){
      client.emit('setUsername', {username: chatUser1.name});
    });

    client.on('setUsernameStatus', function(data){
      data.status.should.equal(true);
      client.disconnect();
      done();
    })
  })

})
