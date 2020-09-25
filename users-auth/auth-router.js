const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./auth-model");

router.post("/register", async (req, res, next) => {
  try {
    const { username, password, phoneNumber } = req.body;

    if (!username || !password || !phoneNumber) {
      res
        .status(401)
        .json({ message: "username, password, and phonenumber are REQUIRED" });
    }

    const user = await Users.findBy({ username }).first();
    const phonenumber = await Users.findBy({ phoneNumber }).first();

    if (username.length > 20) {
      res
        .status(401)
        .json({ message: "Username can NOT exceed 20 characters" });
    }

    if (user) {
      return res.status(409).json({
        message: "Username is already taken",
      });
    }

    if (phonenumber) {
      return res
        .status(409)
        .json({ message: "This phone number is already in use" });
    }

    const newUser = await Users.addUser({
      username,
      password: await bcrypt.hash(password, 8),
      phoneNumber,
    });

    res.status(201).json({ message: `Welcome, ${newUser.username}!` });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();

    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Please enter a username and password" });
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid Username or password",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid Username or password",
      });
    }

    const token = jwt.sign(
      {
        userID: user.id,
      },
      process.env.SECRET || "default secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: `Hey ${user.username}, come here often?`,
      token,
      userid: user.id,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
