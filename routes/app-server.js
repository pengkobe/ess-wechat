var express = require('express');
var router = express.Router();

var User = require('../models/user.js');

// app 登陆
router.post('/applogin', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.login(username,password,function(err,user){
		res.json({user: user});
	});  
});

module.exports = router;