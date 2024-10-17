const db = require("../db/connection");

function selectUsers() {
  return db
    .query("SELECT username, name, avatar_url FROM users")
    .then((results) => results.rows);
}

function selectUserByUsername(username) {
  return db
    .query(
      `
    SELECT 
      username, 
      name, 
      avatar_url 
    FROM users
    WHERE username = $1`,
      [username]
    )
    .then((results) => {
      if (!results.rowCount)
        return Promise.reject({ status_code: 404, msg: "Not found" });

      return results.rows[0];
    });
}

module.exports = { selectUsers, selectUserByUsername };
