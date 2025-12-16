const mongoose = require("mongoose");
const commentModel = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    review_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const comment = mongoose.model("comment", commentModel);
module.exports = comment;
