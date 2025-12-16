const mongoose = require("mongoose");
const reviewModel = mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
reviewModel.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "review_id",
});

reviewModel.set("toJSON", { virtuals: true });
reviewModel.set("toObject", { virtuals: true });

const review = mongoose.model("review", reviewModel);
module.exports = review;
