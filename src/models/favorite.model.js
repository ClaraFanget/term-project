const mongoose = require("mongoose");
const favoriteModel = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

favoriteModel.index({ user_id: 1, book_id: 1 }, { unique: true });

const favorite = mongoose.model("favorite", favoriteModel);
module.exports = favorite;
