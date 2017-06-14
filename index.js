var usernamelist = [];

var express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  io = require('socket.io').listen(server);

var port = process.env.PORT || 8080;
server.listen(port);
console.log("listening on port: " + port);
/*http.listen(process.env.PORT || 8080, function() {
  console.log('listening on', http.address().port);
});*/
/*
var listeningPort = 8080;
server.listen(listeningPort);
console.log("listening on port: " + listeningPort);
*/
/* old routing
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});*/

/*new routing*/
app.use(express.static('public'));
// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1', 'room2', 'room3'];

io.sockets.on('connection', function(socket) {
  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username) {
    // store the username in the socket session for this client
    socket.username = username;
    // store the room name in the socket session for this client
    socket.room = 'room1';
    // add the client's username to the global list
    usernames[username] = username;
    usernamelist.push(username);
    // send client to room 1
    socket.join('room1');
    // echo to client they've connected
    socket.emit('updatechat', 'SERVER', 'you have connected to room1');
    // echo to room 1 that a person has connected to their room
    //echo to console that the user has connected to the room
    console.log(username + " has joined the server (socket id: " + socket.id + ")");
    //kick the player if the username is not selected
    if (username == null) {
      //console log that the player has been kicked
      console.log("null has been kicked from the server");
      //disconnect the user
      socket.emit('disconnect');
    }
    //if the user does have a valid username, add it to the array
    if (username != null) {
      //this is a testing feature, remove it later
      console.log(usernamelist);
    }

    //recieving the data from the user to the server side
    //when the user emits
    socket.on('mouse',
      function(data) {
        //data coes in
        console.log("recieved: 'mouse ' " + data.x + " " + data.y);

        //send the data to all other clients
        socket.broadcast.emit('mouse', data);
      });
  });

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function(data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  });

  /*
    socket.on('switchRoom', function(newroom) {
      var oldRoom = socket.room;
      socket.leave(socket.room);
      socket.join(newroom);
      socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
      //send message to the server
      console.log(socket.username + ' has moved from ' + oldRoom + ' ' + newroom);
      // sent message to OLD room
      socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has left this room');
      // update socket session room title
      socket.room = newroom;
      socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
      socket.emit('updaterooms', rooms, newroom);
    });
    */


  // when the user disconnects.. perform this
  socket.on('disconnect', function() {
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    //echo to the console that the client has left
    console.log(socket.username + " has left the server (socket id: " + socket.id + ")");
    socket.leave(socket.room);
  });
});
