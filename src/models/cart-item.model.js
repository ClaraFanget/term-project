const mongoose = require("mongoose");
const cartItemModel = mongoose.Schema(
  {
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
      required: true,
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const cartItem = mongoose.model("cartItem", cartItemModel);
module.exports = cartItem;
