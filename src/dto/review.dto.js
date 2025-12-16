const Joi = require("joi");

exports.createReviewDTO = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
});

exports.updateReviewDTO = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
});
