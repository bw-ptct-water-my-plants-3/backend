exports.up = async function (knex) {
    await knex.schema
    .createTable("users", (tbl) => {
        tbl.increments("id").unsigned().primary()
        tbl.text("username", 20).unique().notNullable()
        tbl.text("password", 128).notNullable();
        tbl.text("phoneNumber").notNullable().unique()
    })

}

exports.down = async function (knex) {
    return knex.schema
    .dropTableIfExists("users")   
}// make sure to add these "backwards/reverse"