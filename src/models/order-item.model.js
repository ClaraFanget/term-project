const mongoose = require("mongoose");
const orderItemModel = mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
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
    item_amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const orderItem = mongoose.model("orderItem", orderItemModel);
module.exports = orderItem;
