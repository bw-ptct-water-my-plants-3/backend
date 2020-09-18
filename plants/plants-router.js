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

module.exports = router;
