var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis').createClient();
var studentNsp = io.of('/student');
var studentID;
// Subscribe to Redis Channel
redis.subscribe('chat message');

// Listen to subscribed channel/s
redis.on('message', function(channel, message){
 var info = JSON.parse(message);
 io.emit(channel, info);
});

// Get home page
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Default namespace related code
io.on('connection', function(socket){
  io.emit('user-count', Object.keys(io.sockets.sockets).length)
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    io.emit('user-count', Object.keys(io.sockets.sockets).length)
  });
});

// Student namespace related code
studentNsp.on('connection', function(socket){
  // console.log('student ka email hai ' + socket.handshake.query.email)
  var students = []
  console.log(socket.handshake.query.email)
  if(socket.handshake.query.email == 'rahulbhardwaj@avanti.in') {
    studentID = socket.id;
  }
  var connected_students = io.nsps['/student'].sockets
  connected_students.forEach(function (student) {
    students.push(student.handshake.query.email)
  })
  socket.on('chat message', function(msg){
    console.log(msg)
    // io.of('/student').emit('chat message', msg);
    socket.broadcast.to(studentID).emit('chat message', msg);
  });

  console.log(students)
})

// Server listening on
http.listen(4000, function(){
  console.log('listening on *:4000');
});
