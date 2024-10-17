const { selectUsers, selectUserByUsername } = require("../models/users.model");

function getUsers(request, response, next) {
  return selectUsers()
    .then((users) => response.status(200).send({ users }))
    .catch(next);
}

function getUserByUsername(request, response, next) {
  const { username } = request.params;

  return selectUserByUsername(username)
    .then((user) => response.status(200).send({ user }))
    .catch(next);
}

module.exports = { getUsers, getUserByUsername };
