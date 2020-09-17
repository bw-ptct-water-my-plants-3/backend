const db = require("../database/config");

async function addUser(user) {
  const [id] = await db("users").insert(user);
  return findById(id);
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password", "phoneNumber")
    .where(filter);
}

function findById(id) {
  return db("users")
    .select("id", "username", "phoneNumber")
    .where({ id })
    .first();
}

function find() {
  return db("users").select("id", "username");
}

module.exports = {
  addUser,
  findBy,
  findById,
  find,
};
