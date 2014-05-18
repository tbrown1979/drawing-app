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

  it('Should allow user to join group', function(done) {
    var client = io.connect(socketURL, options);
    client.on('connect', function(data){
      client.emit('setUsername', {username: chatUser1.name});
      client.emit('joinGroup', {name: "test"});
    });

    client.on('joinGroupStatus', function(data) {
      data.status.should.equal(true);
      client.disconnect();
      done();
    })
  })

  it('Should send disconnect msg to connected users when a user disconnects', function(done) {
    var client1 = io.connect(socketURL, options);
    client1.on('connect', function(data) {
      client1.emit('setUsername', {username: chatUser1.name});
      client1.emit('joinGroup', {name: "test"});
      var client2 = io.connect(socketURL, options);
      client2.on('connect', function(data) {
        client2.emit('setUsername', {username: chatUser2.name});
        client2.emit('joinGroup', {name: "test"});
        client1.disconnect();
        client2.on('serverGroupMsg', function(data){
          data.msg.should.equal(chatUser1.name + " has left");
          client2.disconnect();
          done();
        })
      });
    })
    // client1.disconnect();
  })

})
