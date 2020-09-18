const db = require("../database/config");

function findPlants() {
  return db("plants");
}

async function addPlant(plant) {
  const [id] = await db("plants").insert(plant);
  return findById(id);
}

function findPlantById(id) {
  return db("plants")
    .select("id", "nickname", "species", "h2oFrequency")
    .first();
}

function findPlantBy(filter) {
  return db("plants").select("id", "nickname", "species", "h2oFrequency");
}

async function updatePlant(id, updated) {
  await db("plants").where({ id }).update(updated);
}

function deletePlant(id) {
  return db("plants").where("id", Number(id)).del();
}

module.exports = {
  findPlants,
  addPlant,
  findPlantById,
  findPlantBy,
  updatePlant,
  deletePlant,
};
