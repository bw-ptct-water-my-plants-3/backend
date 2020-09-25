const router = require("express").Router({ mergeParams: true });
const plants = require("./plants-model");
const users = require("../users/users-model");

router.put("/:id", async (req, res, next) => {
  const { user_id, id } = req.params;
  const {
    nickname: updateNickname,
    species: updateSpecies,
    h2oFrequency,
  } = req.body;
  const updateData = {
    nickname: updateNickname,
    species: updateSpecies,
    h2oFrequency: h2oFrequency,
  };
  if (!updateNickname || !updateSpecies || !h2oFrequency) {
    return res.status(400).json({ message: "All fields must are required" });
  }
  plants.findPlantById(user_id, id).then((plant) => {
    if (!plant) {
      res.status(404).json({ message: "Could not find the specific plant" });
    } else {
      plants.updatePlant(id, updateData);
      res
        .status(200)
        .json({ message: `updated plant ${id}` })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.delete("/:id", async (req, res, next) => {
  try {
    await plants.deletePlant(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  const { user_id } = req.params;
  const specificUser = users.findById(user_id);
  if (specificUser) {
    plants
      .findPlants(user_id)
      .then((plantsData) => {
        if (plantsData.length == 0) {
          res
            .status(404)
            .json({ message: "This user appears to not have any plants" });
        } else {
          res.status(200).json(plantsData);
        }
      })
      .catch((err) => next(err));
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const userID = req.params.user_id;
    const id = req.params.id;

    plants
      .findPlantById(userID, id) //user ref & plant id
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.status(404).json({ message: "plant with said ID not found" });
        }
      });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { nickname, species, h2oFrequency, image } = req.body;
    const { user_id } = req.params;

    const plant = await plants.findPlantBy({ nickname }).first();
    if (plant) {
      return res.status(409).json({
        message: "That plant already exists",
      });
    }

    const newPlant = await plants.addPlant({
      user_id: Number(user_id),
      nickname,
      species,
      h2oFrequency,
      image,
    });
    res.status(201).json(newPlant);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
