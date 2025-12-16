const Joi = require("joi");

exports.createOrderDTO = Joi.object({
  coupon_id: Joi.string().allow(null),
  total_amount: Joi.number().min(0).required(),
});

exports.updateOrderStatusDTO = Joi.object({
  status: Joi.string()
    .valid("ordered", "in preparation", "shipped", "received")
    .required(),
});
