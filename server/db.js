var config = require('../credentials.js').db;  
var env = "development";  
var knex = require("knex")(config[env]);

module.exports = knex;
knex.migrate.latest([config]); 