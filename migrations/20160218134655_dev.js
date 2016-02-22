
exports.up = function(knex, Promise) {
	return Promise.all([


		knex.schema.createTable("case_managers", function(table) {
			table.increments("cmid").primary();

			table.string("first");
			table.string("last");
			table.boolean("active").defaultTo(true);
			
			table.timestamp("updated");
			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("clients", function(table) {
			table.increments("uid").primary();

			table.integer("case_manager")
					 .references("cmid")
					 .inTable("case_managers");

			table.string("first");
			table.string("last");
			table.string("otn");
			table.string("so");

			table.timestamp("updated");
			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("events", function(table) {
			table.increments("event_id").primary();

			table.integer("client")
					 .references("uid")
					 .inTable("clients");

			table.dateTime("date_time");
			table.string("case_num");
			table.string("location");
			table.string("notes");
			table.boolean("fta");

			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("messages", function(table) {
			table.integer("client")
					 .references("uid")
					 .inTable("clients");

			table.integer("case_manager")
					 .references("cmid")
					 .inTable("case_managers");

			table.integer("comm_method")
					 .references("comm_id")
					 .inTable("comm_methods");
					 
			table.string("content");

			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("comm_methods", function(table) {
			table.increments("comm_id").primary();

			table.integer("client")
					 .references("uid")
					 .inTable("clients");

			table.string("type");        // e.g. email, cell, landline
			table.string("value");       // e.g. jim@email.com, 14542348723
			table.string("description"); // e.g. Joe's Obamaphone
			table.boolean("current").defaultTo(true);

			table.dateTime("terminated");
			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("address", function(table) {
			table.integer("client")
					 .references("uid")
					 .inTable("clients");

			table.string("addr1");
			table.string("addr2");
			table.string("city");
			table.string("zip");
			table.string("state");

			table.boolean("current").defaultTo(true);
			table.dateTime("terminated");
			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("alerts", function(table) {
			table.integer("comm_method")
					 .references("comm_id")
					 .inTable("comm_methods");

			table.integer("event")
					 .references("event_id")
					 .inTable("events");

			table.timestamp("created").defaultTo(knex.fn.now());
		})

	])
};

exports.down = function(knex, Promise) {
	return Promise.all([

		knex.schema.dropTable("clients"),
		knex.schema.dropTable("events"),
		knex.schema.dropTable("messages"),
		knex.schema.dropTable("comm_methods"),
		knex.schema.dropTable("address"),
		knex.schema.dropTable("case_managers")

	])
};
