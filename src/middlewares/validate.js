const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");

const validate = (schema) => {
  return (req, res, next) => {
    const options = { abortEarly: false, convert: true };
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      const err = errorCodes.VALIDATION_ERROR;
      return res
        .status(err.status)
        .json(errorResponse(req, err, error.details));
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
