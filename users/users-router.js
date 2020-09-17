const router = require("express").Router();
const Users = require("./users-model");
const restrict = require("../middleware/authenticate");
const bcrypt = require("bcryptjs");

router.get("/", restrict(), async (req, res, next) => {
  try {
    res.json(await Users.find());
  } catch (err) {
    next(err);
  }
});

router.get("/:id", restrict(), async (req, res, next) => {
  try {
    const { id } = req.params;

    await Users.findById(id).then((payload) => {
      if (payload) {
        res.json(payload);
      } else {
        res.status(404).json({ message: "Could not find user by said ID." });
      }
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  // declare
  const { id } = req.params;
  const updatedPass = req.body.password;
  const updatedPhone = req.body.phoneNumber;
  //hash body.password
  const hash = await bcrypt.hash(updatedPass, 8); //match auth complex so hash matches
  //set updated object with hashed password and new phonenumber
  const updatedata = {
    password: hash,
    phoneNumber: req.body.phoneNumber,
  };
  if (!req.body.phoneNumber || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Please include password and phonenumber" });
  }
  Users.findById(id) // find user via params and update new info
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "Could not find user by said ID." });
      } else {
        Users.update(id, updatedata);
        res
          .status(200)
          .json({ message: `updated user ${id}` })

          .catch((err) => {
            next(err);
          });
      }
    });
});

module.exports = router;
