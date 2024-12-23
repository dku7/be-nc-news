const db = require("../db/connection");
const format = require("pg-format");

function selectArticleById(article_id) {
  let queryString = `
    SELECT
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.body,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(comments.comment_id) AS INT) AS comment_count -- force to integer, otherwise returns as string in object
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY
      articles.article_id`;

  return db.query(queryString, [article_id]).then((results) => {
    if (!results.rowCount)
      return Promise.reject({ status_code: 404, msg: "Not found" });

    return results.rows[0];
  });
}

function selectArticles(
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p
) {
  const allowedSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const allowedOrders = ["asc", "desc"];

  let queryString = "";
  const queryValues = [];

  if (!allowedSortBy.includes(sort_by) || !allowedOrders.includes(order)) {
    return Promise.reject({ status_code: 400, msg: "Bad request" });
  }

  queryString = `
    SELECT
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(comments.comment_id) AS INT) AS comment_count -- force to integer, otherwise returns as string in object
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    queryString += " WHERE topic = $1 ";
    queryValues.push(topic);
  }

  queryValues.push(limit);

  queryString += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
    LIMIT $${queryValues.length}`;

  if (p) {
    queryValues.push(limit * (p - 1));
    queryString += ` OFFSET $${queryValues.length}`;
  }

  return db.query(queryString, queryValues).then((results) => results.rows);
}

function updateArticleById(inc_votes, article_id) {
  return db
    .query(
      `
    UPDATE articles
    SET votes = (votes + $1)
    WHERE article_id = $2
    RETURNING *`,
      [inc_votes, article_id]
    )
    .then((results) => results.rows[0]);
}

function insertNewArticle(newArticle) {
  const insertValues = [];

  for (key in newArticle) insertValues.push(newArticle[key]);

  return db
    .query(
      format(
        `INSERT INTO articles (
          author,
          title,
          body,
          topic,
          article_img_url
      ) VALUES %L RETURNING *`,
        [insertValues]
      )
    )
    .then((results) => results.rows[0].article_id);
}

function deleteArticleByArticleId(article_id) {
  return db.query("DELETE FROM articles WHERE article_id = $1", [article_id]);
}

module.exports = {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertNewArticle,
  deleteArticleByArticleId,
};
