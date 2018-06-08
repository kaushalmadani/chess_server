const connection=require('./connection.js');
var clients = [];
exports.extra=function(request,response,io){
	var status={};
	var socket = require('socket.io-client')('http://localhost:5100');
	io.on('connection', function(socket){
		clients.push(socket.id);
	});	
}
exports.start_game=function(request,response){
	var result={};
	result.status=1;
	result.msg="Success";
	result.data=false;
	if(!request.body.user_id || request.body.user_id==0){
		result.status=3;
		result.msg="Missing user_id";
		response.send(result);
	}else if(!request.body.opponent_id || request.body.opponent_id==0){
		result.status=3;
		result.msg="Missing opponent_id";
		response.send(result);
	}else if(!request.body.socket_id || request.body.socket_id==0){
		result.status=3;
		result.msg="Missing socket_id";
		response.send(result);
	}else{
		var q="insert into user_request (user_id,opponent_id,user_socket_id,is_accept) values ("+request.body.user_id+","+request.body.opponent_id+",'"+request.body.socket_id+"',0)"
		console.log(q);
		connection.getConnection().query(q,function(err,success){
			//console.log(success.insertId);
			if(err){
				result.status=2;
				result.msg="Server error";
				response.send(result);
			}else{
				result.data={};
				result.data.request_id=success.insertId;
				response.send(result);
			}
		});		
	}
}
exports.get_request=function(request,response){
	var result={};
	result.status=1;
	result.msg="Success";
	result.data=false;
	if(!request.body.user_id || request.body.user_id==0){
		result.status=3;
		result.msg="Missing user_id";
		response.send(result);
	}else{
		var q="select r.*,user.user_name from user_request r join user_master user on r.user_id=user.user_id where opponent_id="+request.body.user_id+" and is_accept=0"
		//console.log(q);
		connection.getConnection().query(q,function(err,rows){
			if(err){
				result.status=2;
				result.msg="Server Error";
				response.send(result);
			}else{
				result.data={};
				result.data=rows;
				response.send(result);
			}
		});		
	}
}
exports.make_move=function(request,response){
	var result={};
	result.status=1;
	result.msg="Success";
	result.data=false;
	if(!request.body.user_id || request.body.user_id==0){
		result.status=3;
		result.msg="Missing user_id";
		response.send(result);
	}else{
		var q="select r.*,user.user_name from user_request r join user_master user on r.user_id=user.user_id where opponent_id="+request.body.user_id+" and is_accept=0"
		//console.log(q);
		connection.getConnection().query(q,function(err,rows){
			if(err){
				result.status=2;
				result.msg="Server Error";
				response.send(result);
			}else{
				result.data={};
				result.data=rows;
				response.send(result);
			}
		});		
	}
}
exports.accept_request=function(request,response,io){
	var result={};
	result.status=1;
	result.msg="Success";
	result.data=false;
	if(!request.body.request_id || request.body.request_id==0){
		result.status=3;
		result.msg="Missing request_id";
		response.send(result);
	}else{
		var q="update user_request set is_accept=1,opponent_socket_id='"+request.body.socket_id+"' where request_id="+request.body.request_id;		
		//console.log(q);
		connection.getConnection().query(q,function(err,rows){
			if(err){
				result.status=2;
				result.msg="Server Error";
				response.send(result);
			}else{
				var q="select * from user_request where request_id="+request.body.request_id;
				connection.getConnection().query(q,function(err,rows){
					if(err){
						result.status=2;
						result.msg="Server Error";
						response.send(result);
					}else{
						var user={};
						user.user_socket_id=rows[0].opponent_socket_id;
						user.opponent_socket_id=rows[0].user_socket_id;
						user.is_accept=rows[0].is_accept;
						io.to(rows[0].user_socket_id).emit('start_game',JSON.stringify(rows[0]));
						io.to(rows[0].opponent_socket_id).emit('start_game',JSON.stringify(user));
						result.data=true;
						response.send(result);
					}
				});	
			}
		});		
	}
}