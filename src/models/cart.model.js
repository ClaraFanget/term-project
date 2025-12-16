const mongoose = require("mongoose");
const cartModel = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const cart = mongoose.model("cart", cartModel);
module.exports = cart;
