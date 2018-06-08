var nodemailer = require('nodemailer');
var Constant = require('../Constant.js');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kaushalmadani1206@gmail.com',
    pass: 'iloveu@1206'
  }
});
var self=module.exports={
	forgotPassword:function(email,password){
		return '<div style="border:1px solid;padding:10px"><p>Dear,'+email+'!!<br/></p><p>Your password is reset to <strong>'+password+'</strong></p><p>Please <a target="_blank" href="'+Constant.getServer()+'">Login</a> again to enjoy at Chess!!</p></div>';
	},
	forgotPasswordMail:function(to,password){
		var mailOptions = {
		  from: 'kaushalmadani1206@gmail.com',
		  to: to,
		  subject: "Forgot Password Request",
		  html:self.forgotPassword(to,password),
		};
		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		});
	}
}