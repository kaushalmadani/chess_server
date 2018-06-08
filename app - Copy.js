var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var path = require('path');
var dir = path.join(__dirname, './uploads');
var node = path.join(__dirname, './node_modules');

var user = require('./api/user.js');
var game = require('./api/game.js');

var port = process.env.PORT || 5200;

app.use(express.static(dir));
app.use(cors());
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var http = require('http').createServer(app); 
/*http.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on `+port);
});*/
//ADDED
if (typeof(PhusionPassenger) != 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}
if (typeof(PhusionPassenger) != 'undefined') {
    http.listen('passenger');
} else {
    http.listen(port);
}

//Start Socket
var io = require('socket.io').listen(http);
io.on('connection', function(socket){
	console.log("connect"+socket.id);
	socket.emit("s_id",socket.id);
	socket.on("move",function(data){
		console.log("data:"+data);
	})
});
//End Socket



//Game module
app.post('/chess_server/start_game',function(request,response){
	game.start_game(request,response);
});
app.post('/chess_server/get_request',function(request,response){
	game.get_request(request,response);
});
app.post('/chess_server/accept_request',function(request,response){
	game.accept_request(request,response,io);
});
app.get('/chess_server/make_move',function(request,response){
	console.log("id:"+request.query.id);
	io.to(request.query.id).emit('get_move',request.query.msg);
	response.send("success");
});
app.get("/chess_server/home",function(request,response){
	var status={};
	status.status=1;
	status.response="Welcome to chess";
	response.send(status);
});
//Login
app.post("/chess_server/chess_server/user_login",function(request,response){
	user.user_login(request,response);
});

//Register
app.post("/chess_server/chess_server/save_user",function(request,response){
	user.save_user(request,response);
});

//Forgot Password
app.post("/chess_server/chess_server/forgot_password",function(request,response){
	user.forgot_password(request,response);
});

//Change Password
app.post("/chess_server/change_password",function(request,response){
	user.change_password(request,response);
});

//Userlist
app.post("/chess_server/get_userlist",function(request,response){
	user.get_userlist(request,response);
});

module.exports = app;