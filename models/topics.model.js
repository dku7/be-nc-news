const db = require("../db/connection");

function selectTopics() {
  return db.query("SELECT * FROM topics").then((results) => results.rows);
}

module.exports = { selectTopics };
