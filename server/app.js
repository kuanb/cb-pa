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

// common response types
var res_types = {
	affirmative: ["Y","YE","YS","YA","YES","YEP","YUP","YEA","YEAH"]
};

app.get("/", function (req, res) {
	res.send("Hello.")
});

app.post("/sms", function (req, res) {
	var twiml = new twilio.TwimlResponse();
	var from = req.body.From.replace(/\D+/g, "");
	var text = req.body.Body.toUpperCase();

	db("comm_methods").where("value", from).limit(1).then(function (device) {
		
		// log the current session state...
		console.log(req.session.state);

		if (!req.session.state) {
			// create a new user if this phone number has never been used
			if (device.length == 0) {
				twiml.sms("Welcome to CourtSMS. We don't have this number on file. Reply \"YES\" to sign up for alerts.");
				req.session.state = "request_signup";
				res.send(twiml.toString());
			}
		} else {
			if (req.session.state == "request_signup") {
				if (res_types.affirmative.indexOf(text) > -1 && device.length == 0) {
					console.log("inserting...", from);
					db("comm_methods").returning("cid").insert({
						type: "cell",
						value: from
					}).then(function () {
						console.log("hurray");
						twiml.sms("Thanks. You have been signed up for notifications. Reply \"CANCEL\" at any time to opt out.");
						req.session.state = undefined;
						res.send(twiml.toString());
					});
				}
			}
		}

		
	});
});

var port = 4000;
app.listen(port, function () { console.log("Listening on port", port); });