const Joi = require("joi");

exports.createUserDTO = Joi.object({
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  birth_date: Joi.date().required(),
  gender: Joi.string().valid("female", "male", "other"),
  is_admin: Joi.forbidden(),
  is_active: Joi.forbidden(),
  address: Joi.string(),
  phone_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
});

exports.updateMeDTO = Joi.object({
  first_name: Joi.string().min(1).max(100),
  last_name: Joi.string().min(1).max(100),
  email: Joi.string().email(),
  address: Joi.string(),
  phone_number: Joi.string().pattern(/^[0-9]{10}$/),
});
