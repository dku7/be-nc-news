const db = require("../db/connection");

function selectCommentsByArticleId(article_id) {
  return db
    .query(
      `
    SELECT
      comment_id,
      votes,
      created_at,
      author,
      body,
      article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `,
      [article_id]
    )
    .then((results) => {
      if (!results.rowCount)
        return Promise.reject({ status_code: 404, msg: "Not found" });

      return results.rows;
    });
}

module.exports = { selectCommentsByArticleId };
