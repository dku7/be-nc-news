const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/users.controller");

// handle requests for /api/users
usersRouter.get("/", getUsers);

module.exports = usersRouter;
