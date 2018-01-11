/* var express = require('express');// changed this var app=require('express')();
var app = express();
var http = require('http').Server(app);
//var url = require('url');
var path = require('path');


app.use(express.static(path.join(__dirname, "/public")));
console.log(__dirname);
app.get('/sumogame.html', function(req, res){
	res.sendFile(__dirname + '/index.html');
	//res.sendFile(__dirname + '/style.css');	
	//res.sendFile(__dirname + '/spaceScript.js');
	
});

http.listen(3001, '0.0.0.0', function(){
  console.log('listening on *:3000');
}); */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var player = 0;
var room =0;
var oppFound = "Player Found!";
var red= "Red";
var blue= "Blue";
//var oneDay = 86400000; 


app.use(express.static(__dirname + '/public' ));

io.on('connection', function(socket){
	console.log("looking for opponent");
  socket.on('play game', function(msg){
   console.log('data inputted: ' + msg);
	io.to(msg).emit('start the game', msg);
  });
  socket.on('space pressed', function(msg){
	  io.to(msg).emit('space', msg);
	    });
	socket.on('enter pressed', function(msg){
		io.to(msg).emit('enter', msg);	
	});
	socket.on('replay game', function(msg){
		io.to(msg).emit('replay', msg);	
	});
	socket.on('which player', function(msg){
		socket.join(room);
		socket.emit('this player', player);	
		socket.emit('get room', room);
		if(player == 0){
			player = 1;
			socket.emit('red', red);
		} else{
			player = 0;
			io.in(room).emit('opponent found', oppFound);
			socket.emit('blue', blue);
			room++;		
		}	
		
	});
});

http.listen(3000);
console.log('listening on :3000');
