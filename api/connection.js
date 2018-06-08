var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'chess',
  multipleStatements: true
});
connection.connect(function(err){
	if(err)
		console.log("Not Connected"+err);
	else
		console.log("Connected!!");
});
exports.getConnection=function(response){
	return connection;
}
exports.closeConnection=function(response){
	connection.end();
}