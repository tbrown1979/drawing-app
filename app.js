var express = require('express');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var server = require('http').createServer(app);
var routes = require('./routes');
var server_messages = require('./server-messages.js')(server);

// all environments
var port = process.env.PORT || 8000;
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/pictionary', routes.pictionary);

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

server.listen(port);

