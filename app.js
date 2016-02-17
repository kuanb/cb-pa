// credentials loading
var creds = require("./credentials.json");
var ACCOUNT_SID = creds.accountSid,
		AUTH_TOKEN = creds.authToken,
		SESS_SECRET = creds.sessionSecret;

// app initialization
var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();

// express customization
app.set("view engine", "ejs");
app.use('/public', express.static(__dirname + '/public'));

// twilio
var twilio = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

app.get("/", function (req, res) {
	res.render("index")
});

app.get("/test", function () {
	twilio.messages.create({  
		to: "+18588694735",
		from: "+16198702271",
		body: "This is a Hello World",
	}, function(err, message) { 
		if (err) {
			console.log("Error: ", err);
		} else {
			console.log("Success ", message);
		}
	});
})


// utilities
function isAuthenticated(req, res, next) {
	if (req.user.authenticated) {
		return next();
	} else {
		res.redirect('/login');
	}
}



app.listen(8080, function () {
	console.log("Now listening on Port 8080...");
});