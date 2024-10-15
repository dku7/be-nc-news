const db = require("../db/connection");

function selectUsers() {
  return db
    .query("SELECT username, name, avatar_url FROM users")
    .then((results) => results.rows);
}

module.exports = { selectUsers };
