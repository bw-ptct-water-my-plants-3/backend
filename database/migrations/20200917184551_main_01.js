exports.up = async function (knex) {
  await knex.schema.createTable("users", (tbl) => {
    tbl.increments("id").unsigned().primary();
    tbl.text("username", 20).unique().notNullable();
    tbl.text("password").notNullable();
    tbl.text("phoneNumber").notNullable().unique();
  });

  await knex.schema.createTable("plants", (tbl) => {
    tbl.increments().unsigned().primary();
    tbl
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    tbl.text("nickname").notNullable();
    tbl.text("species").notNullable();
    tbl.integer("h20Frequency").notNullable();
    tbl.text("image"); //img src/ URL for now
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("plants");
  await knex.schema.dropTableIfExists("users");
}; // make sure to add these "backwards/reverse"
