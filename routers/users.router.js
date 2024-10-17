const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controller");

// handle requests for /api/users
usersRouter.get("/", getUsers);

// handle requests for /api/users/:username
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
