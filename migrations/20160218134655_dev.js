
exports.up = function(knex, Promise) {
	return Promise.all([

		knex.schema.createTable("users", function(table) {
			table.increments("uid").primary();
			table.string("first");
			table.string("last");
			table.string("otn");
			table.string("so");
			table.timestamps();
		}),

		knex.schema.createTable("events", function(table) {
			table.integer("user")
					 .references("uid")
					 .inTable("users");

			table.dateTime("date_time");
			table.string("case_num");
			table.string("location");
			table.string("notes");
			table.boolean("fta");

			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("messages", function(table) {
			table.integer("user")
					 .references("uid")
					 .inTable("users");

			table.integer("comm_method")
					 .references("cid")
					 .inTable("comm_methods");
					 
			table.string("content");

			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("comm_methods", function(table) {
			table.increments("cid").primary();

			table.integer("user")
					 .references("uid")
					 .inTable("users");

			table.string("name");  // e.g. Joe's Obamaphone
			table.string("type");  // e.g. email, cell, landline
			table.string("value"); // e.g. jim@email.com, 14542348723

			table.boolean("current");
			table.dateTime("terminated");
			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("address", function(table) {
			table.integer("user")
					 .references("uid")
					 .inTable("users");

			table.string("addr1");
			table.string("addr2");
			table.string("city");
			table.string("zip");
			table.string("state");

			table.boolean("current");
			table.dateTime("terminated");
			table.timestamp("created").defaultTo(knex.fn.now());
		})

	])
};

exports.down = function(knex, Promise) {
	return Promise.all([

		knex.schema.dropTable("users"),
		knex.schema.dropTable("events"),
		knex.schema.dropTable("messages"),
		knex.schema.dropTable("comm_methods"),
		knex.schema.dropTable("address")

	])
};
