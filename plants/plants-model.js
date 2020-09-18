const db = require("../database/config");

function findPlants() {
  return db("plants");
}

async function addPlant(plant) {
  const [id] = await db("plants").insert(plant);
  return findById(id);
}

async function findPlantById(user_id, plant_id) {
  return db("plants")
    .where("id", plant_id)
    .first()
    .andWhere("user_id", user_id)
    .first();
}

function findPlantBy(filter) {
  return db("plants")
    .select("id", "nickname", "species", "h2oFrequency")
    .where(filter);
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
