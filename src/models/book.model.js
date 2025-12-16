const mongoose = require("mongoose");
const bookModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Enter a title"],
    },
    author: {
      type: String,
      required: [true, "Enter an author"],
    },
    publication_date: {
      type: Date,
      required: [true, "Enter a publication date"],
    },
    literary_genre: {
      type: String,
      enum: [
        "fantasy",
        "horror",
        "mystery",
        "romance",
        "science fiction",
        "dystopian",
        "biography",
        "drama",
        "fable",
        "poetry",
        "historical",
      ],
      required: [true, "Enter a literary genre"],
    },
    price: {
      type: Number,
      required: [true, "Enter a price"],
    },
    summary: {
      type: String,
      required: [true, "Enter a summary"],
    },
    publisher: {
      type: String,
      required: [true, "Enter a publisher"],
    },
    isbn: {
      type: String,
      required: [true, "Enter a isbn"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const book = mongoose.model("book", bookModel);
module.exports = book;
