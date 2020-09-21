const router = require("express").Router();
const plants = require("./plants-model");
const restrict = require("../middleware/authenticate");
const users = require("../users/users-model");

router.get("/", restrict(), async (req, res, next) => {
  try {
    res.json(await plants.findPlants());
  } catch (err) {
    next(err);
  }
});


router.get("/:id/plants", async (req, res, next) => {
  const { id } = req.params;

  const specificUser = users.findById(id);
  if (specificUser) {
    plants
      .findPlants(id)
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

// get plant by id 
router.get("/:user_id/plants/:id", async (req, res, next) => {
  try {
    const userID = req.params.user_id;
    const id = req.params.id;
    plants
      .findPlantById(userID, id) //user ref & plant id
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res
            .status(404)
            .json({ message: "plant with said ID not found" });
        }
      });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
