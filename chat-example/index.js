var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis').createClient();

redis.subscribe('chat message');

redis.on('message', function(channel, message){
 var info = JSON.parse(message);
 io.emit(channel, info);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});
