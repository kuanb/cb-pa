// credentials loading
var credentials = require("../credentials");
var ACCOUNT_SID = credentials.accountSid,
		AUTH_TOKEN = credentials.authToken,
		SESS_SECRET = credentials.sessionSecret;

// app initialization
var express = require("express");
var app = express();
var db  = require("./db");

var port = 4000;
app.listen(port, function () { console.log("Listening on port", port); });