const { selectUsers } = require("../models/users.model");

function getUsers(request, response, next) {
  return selectUsers()
    .then((users) => response.status(200).send({ users }))
    .catch(next);
}

module.exports = { getUsers };