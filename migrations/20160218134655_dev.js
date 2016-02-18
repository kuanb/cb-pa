
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
			table.string("authority");
			table.string("location");
			table.string("notes");
			table.boolean("fta");

			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("curr_contact", function(table) {
			table.integer("user")
			     .references("uid")
			     .inTable("users");

			table.string("type");
			table.string("value");

			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("curr_address", function(table) {
			table.integer("user")
			     .references("uid")
			     .inTable("users");

			table.string("addr1");
			table.string("addr2");
			table.string("city");
			table.string("zip");
			table.string("state");

			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("prev_contact", function(table) {
			table.integer("user")
			     .references("uid")
			     .inTable("users");

			table.string("type");
			table.string("value");

			table.dateTime("terminated");
			table.dateTime("initiated");
		}),

		knex.schema.createTable("prev_address", function(table) {
			table.integer("user")
			     .references("uid")
			     .inTable("users");

			table.string("addr1");
			table.string("addr2");
			table.string("city");
			table.string("zip");
			table.string("state");

			table.dateTime("terminated");
			table.dateTime("initiated");
		})

	])
};

exports.down = function(knex, Promise) {
	return Promise.all([

		knex.schema.dropTable("users"),
		knex.schema.dropTable("events"),
		knex.schema.dropTable("curr_contact"),
		knex.schema.dropTable("curr_address"),
		knex.schema.dropTable("prev_contact"),
		knex.schema.dropTable("prev_address")

	])
};
