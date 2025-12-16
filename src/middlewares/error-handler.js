const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");

module.exports = (err, req, res, next) => {
  const error = err.errorCode || errorCodes.INTERNAL_ERROR;

  res.status(error.status).json(errorResponse(req, error, err.details || null));
};
