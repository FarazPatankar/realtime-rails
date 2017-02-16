var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis').createClient();

redis.subscribe('chat message');

redis.on('message', function(channel, message){
 var info = JSON.parse(message);
 console.log(channel)
 io.emit(channel, info);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	io.emit('user-count', Object.keys(io.sockets.sockets).length)
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log(msg)
  });
  socket.on('disconnect', function(){
		io.emit('user-count', Object.keys(io.sockets.sockets).length)
  });
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});
