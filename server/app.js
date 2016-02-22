// credentials loading
var credentials = require("../credentials");
var ACCOUNT_SID = credentials.accountSid,
		AUTH_TOKEN = credentials.authToken,
		SESS_SECRET = credentials.sessionSecret;

// app initialization
var express = require("express");
var app = express();
var db  = require("./db");

// dependencies
var twilio = require("twilio");
var bodyParser = require('body-parser');
var session = require("express-session");
var cookieParser = require("cookie-parser");

app.set('view engine', 'ejs');

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
	affirmative: ["Y","YE","YS","YA","YES","YEP","YUP","YEA","YEAH"],
	negative: ["N","NO","NE","NA","NOPE","NOOPE","NAH","NAHH","NAY","NOO","NOOO"]
};

app.get("/case_managers", function (req, res) {
	var offset = req.query.offset;
	if (!offset) { offset = 0; }

	db("case_managers").limit(25).offset(offset).then(function (rows) {
		res.render("case_managers", {rows: rows});
	});
});

app.post("/case_managers", function (req, res) {
	var first = req.body.first,
	    last = req.body.last;

	// test that they are valid entries
	var strings_ok = typeof first == "string" && typeof last == "string";
	var lengths_ok = first.length > 1 && last.length > 1;
	if (strings_ok && lengths_ok) {
		db("case_managers").insert({
			first: first,
			last: last
		}).then(function () {
			res.send("Success. Return to <a href=\"/case_managers\">all case managers view</a>.");
		});
	} else {
		res.send("Bad submission. Go <a href=\"/case_managers\">back</a> and try again.");
	}
});

app.post("/sms", function (req, res) {
	var twiml = new twilio.TwimlResponse();
	var from = req.body.From.replace(/\D+/g, "");
	var text = req.body.Body.toUpperCase();

	db("comm_methods").where("value", from).limit(1).then(function (device) {

		if (!req.session.state) {

			// create a new user if this phone number has never been used
			if (device.length == 0) {
				twiml.sms("Welcome to CourtSMS. We don't have this number on file. Reply \"YES\" to register for alerts.");
				req.session.state = "request_signup";
				res.send(twiml.toString());
			}

		} else {

			// don't have this number in our system
			if (device.length == 0) {

				if (req.session.state == "request_signup") {

					// they do want alerts
					if (res_types.affirmative.indexOf(text) > -1) {
						db("comm_methods").returning("comm_id").insert({
							type: "cell",
							value: from
						}).then(function () {
							twiml.sms("You\'ve signed up. Reply with the case numbers, separated by spaces, for which you want alerts. Reply \"STOP\" at any time to opt out.");
							req.session.state = "case_signup";
							res.send(twiml.toString());
						});
					}
				
				// the are adding case to monitor
				}

			}
		}

		
	});
});

var port = 4000;
app.listen(port, function () { console.log("Listening on port", port); });