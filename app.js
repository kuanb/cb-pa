var express = require("express");
var app = express();

var creds = require("./credentials.json");
var ACCOUNT_SID = creds.accountSid,
		AUTH_TOKEN = creds.authToken;

//require the Twilio module and create a REST client
var client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

client.messages.create({  
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