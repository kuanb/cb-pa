// credentials loading
var credentials = require("../credentials");
var ACCOUNT_SID = credentials.accountSid,
		AUTH_TOKEN = credentials.authToken,
		SESS_SECRET = credentials.sessionSecret;

// app initialization
var express = require("express");
var app = express();
var db  = require("./db");

// twilio-related dependencies
var twilio = require("twilio");
var bodyParser = require('body-parser');
var session = require("express-session");
var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(session({
	secret:SESS_SECRET,
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/", function (req, res) {
	res.send("Hello.")
});

app.post("/sms", function (req, res) {
	var twiml = new twilio.TwimlResponse();
	var from = req.body.From.replace(/\D+/g, "");
	var text = req.body.Body.toUpperCase();

	db("comm_methods").where("value", from).limit(1).then(function (row) {
		// create a new user if this phone number has never been used
		if (row.length == 0) {

		}

		if (req.session.state == undefined) {
			twiml.sms("Thanks, yo. This is what I received from you: " + text);
			req.session.state
		}
	});

	
	
	res.send(twiml.toString());
});

var port = 4000;
app.listen(port, function () { console.log("Listening on port", port); });