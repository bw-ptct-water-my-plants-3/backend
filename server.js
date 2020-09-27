const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const server = express();
require("dotenv/config");

server.use(helmet());
server.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));
server.use(express.json());
server.use(express.urlencoded());
server.use(
  morgan(":method :url :status :res[content-type] - :response-time ms")
);

const restrict = require("./middleware/authenticate");
const authRouter = require("./users-auth/auth-router.js");
const usersRouter = require("./users/users-router");
const welcomeRouter = require("./welcome");

// do NOT put "/" at the end of an address or it will break CORS origin policy

server.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

server.use("/users/", restrict(), usersRouter);
server.use("/auth", authRouter);
server.use("/", welcomeRouter);

module.exports = server;
