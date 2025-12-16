const mongoose = require("mongoose");
const orderModel = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupon",
      default: null
    },
    total_amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["ordered", "in preparation", "shipped", "received"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("order", orderModel);
module.exports = order;
