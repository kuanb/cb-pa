# cb-pa
Initial foray into Twilio API integration with Node backend. Let's call this "Version 0.0.5"

### What you need to get this going
Standard `node` affair, just run `npm install`. Only other thing you will need is a `credential.js` file that looks like the following:
```
module.exports = {
	"accountSid": "xxxxxxxxxxxxxx",
	"authToken": "xxxxxxxxxxxxxx",
	"sessionSecret": "xxxxxxxxxxxxxx"
}
```
Place that file in your root directory. You will also want to customize your `knex.js` hook up so that it syncs up with the right local db you are running (or production, of course). We are using Postgres for this tool.