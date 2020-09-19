const router = require("express").Router();
const Plants = require("./plants-model");
const restrict = require("../middleware/authenticate");

router.get("/", restrict(), async (req, res, next) => {
  try {
    res.json(await Plants.findPlants());
  } catch (err) {
    next(err);
  }
});

router.get("/:id/plants", restrict(), async (req, res, next) => {
  try {
    const { id } = req.params;

    await Plants.findPlantById(id).then((payload) => {
      if (payload) {
        res.json(payload);
      } else {
        res.status(404).json({ message: "Could not find the specific plant" });
      }
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/plants", async (req, res, next) => {
  const { id } = req.params;
  const updateNickname = req.body.nickname;
  const updateSpecies = req.body.species;
  const h2oFrequency = req.body.h2oFrequency;

  const updateData = {
    nickname: req.body.nickname,
    species: req.body.species,
    h2oFrequency: req.body.h2oFrequency,
  };
  if (!req.body.nickname || req.body.species || req.body.h2oFrequency) {
    return res.status(400).json({ message: "All fields must are required" });
  }
  Plants.findPlantById(id).then((plant) => {
    if (!plant) {
      res.status(404).json({ message: "Could not find the specific plant" });
    } else {
      Plants.updatePlant(id, updateData);
      res
        .status(200)
        .json({ message: `updated plant ${id}` })

        .catch((err) => {
          next(err);
        });
    }
  });
});

router.post("/plants", async (req, res, next) => {
  try {
    const { nickname, species, h2oFrequency } = req.body;
    const plant = await Plants.findPlantBy({ nickname }).first();

    if (plant) {
      return res.status(409).json({
        message: "That plant already exists",
      });
    }
    const newPlant = await Plants.addPlant({
      nickname,
      species,
      h2oFrequency,
    });
    res.status(201).json(newPlant);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
