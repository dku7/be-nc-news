const db = require("../db/connection");

function selectArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((results) => {
      if (!results.rowCount)
        return Promise.reject({ status_code: 404, msg: "Not found" });

      return results.rows;
    });
}

module.exports = { selectArticleById };
