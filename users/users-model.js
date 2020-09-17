const db = require("../database/config")

function find() {
    return db("users").select("id", "username", "phoneNumber")
}

async function add(user) {
    const [id] = await db("users").insert(user)
    return findById(id)
}

function findById(id) {
    return db("users")
        .select("id", "username", "phoneNumber")
        .where({ id })
        .first()
}

function findBy(filter) {
    return db("users")
        .select("id", "username", "password", "phoneNumber")
        .where(filter)
}


async function update(id, updated) {

    await db("users")
        .where({ id })
        .update(updated)
}


module.exports = {
    add,
    find,
    findBy,
    findById,
    update,
}