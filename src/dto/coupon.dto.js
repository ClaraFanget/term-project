const Joi = require("joi");

exports.createCouponDTO = Joi.object({
  code: Joi.string().uppercase().required(),
  discount_rate: Joi.number().min(1).max(100).required(),
  start_at: Joi.date().required(),
  end_at: Joi.date().greater(Joi.ref("start_at")).required(),
  is_valid: Joi.boolean().required(),
});

exports.updateCouponDTO = Joi.object({
  code: Joi.string().uppercase(),
  discount_rate: Joi.number().min(1).max(100),
  start_at: Joi.date(),
  end_at: Joi.date().greater(Joi.ref("start_at")),
  is_valid: Joi.boolean(),
});
