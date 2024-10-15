function badPathsErrorHandler(request, response) {
  response.status(404).send({ msg: "Path not found" });
}

function customErrorHandler(error, request, response, next) {
  if (error.status_code && error.msg) {
    response.status(error.status_code).send({ msg: error.msg });
  } else next(error);
}

function psqlErrorHandler(error, request, response, next) {
  if (error.code) {
    switch (error.code) {
      case "22P02": // wrong data type
      case "23502": // not-null violations
        return response.status(400).send({ msg: "Bad request" });

      case "23503": // constraint violations
        return response.status(404).send({ msg: "Not found" });
    }
  } else next(error);
}
function defaultErrorHandler(error, request, response, next) {
  response.status(500).send({ msg: "Internal server error" });
}

module.exports = {
  badPathsErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
  defaultErrorHandler,
};
