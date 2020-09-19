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

router.get("/:id", restrict(), async (req, res, next) => {
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

module.exports = router;
