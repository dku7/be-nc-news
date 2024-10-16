const apiRouter = require("express").Router();
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");
const topicsRouter = require("./topics.router");
const commentsRouter = require("./comments.router");

const { getEndpoints } = require("../controllers/endpoints.controller");

apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
