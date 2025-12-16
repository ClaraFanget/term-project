const Joi = require("joi");

exports.loginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.refreshDTO = Joi.object({
  refresh_token: Joi.string().required(),
});
