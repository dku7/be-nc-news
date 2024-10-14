function badPathsErrorHandler(request, response) {
  response.status(404).send({ msg: "Path not found" });
}

function defaultErrorHandler(error, request, response) {
  response.status(500).send({ msg: "Internal server error" });
}

module.exports = { badPathsErrorHandler, defaultErrorHandler };
