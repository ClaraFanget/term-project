const Joi = require("joi");

exports.createCommentDTO = Joi.object({
  comment: Joi.string().min(1).required(),
});

exports.updateCommentDTO = Joi.object({
  comment: Joi.string().required(),
});
