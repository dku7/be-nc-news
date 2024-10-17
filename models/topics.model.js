const db = require("../db/connection");
const format = require("pg-format");

function selectTopics() {
  return db.query("SELECT * FROM topics").then((results) => results.rows);
}

function insertNewTopic(newTopic) {
  return db
    .query(
      format(
        `INSERT INTO topics (slug, description) 
      VALUES %L 
      RETURNING *`,
        [[newTopic.slug, newTopic.description]]
      )
    )
    .then((results) => results.rows[0]);
}

module.exports = { selectTopics, insertNewTopic };
