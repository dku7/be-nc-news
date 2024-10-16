const express = require("express");
const apiRouter = require("./routers/api.router");

const {
  badPathsErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
  defaultErrorHandler,
} = require("./error-handlers");

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

/**********************************************
 * Error handlers
 **********************************************/
app.all("*", badPathsErrorHandler);
app.use(customErrorHandler);
app.use(psqlErrorHandler);
app.use(defaultErrorHandler);

module.exports = app;
