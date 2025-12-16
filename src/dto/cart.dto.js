const Joi = require("joi");

exports.addCartItemDTO = Joi.object({
  book_id: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

exports.updateCartItemDTO = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});
