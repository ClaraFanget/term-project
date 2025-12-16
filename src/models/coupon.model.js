const mongoose = require("mongoose");
const couponModel = mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount_rate: {
      type: Number,
      required: true,
    },
    start_at: {
      type: Date,
      required: true,
    },
    end_at: {
      type: Date,
      required: true,
    },
    is_valid: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const coupon = mongoose.model("coupon", couponModel);
module.exports = coupon;
