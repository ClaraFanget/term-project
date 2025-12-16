const Joi = require("joi");

exports.createBookDTO = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  literary_genre: Joi.string()
    .required()
    .valid(
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
      "historical"
    ),
  publication_date: Joi.date().required(),
  publisher: Joi.string().required(),
  price: Joi.number().min(0).required(),
  isbn: Joi.string().required(),
  summary: Joi.string().required(),
});

exports.updateBookDTO = Joi.object({
  title: Joi.string(),
  author: Joi.string(),
  literary_genre: Joi.string().valid(
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
    "historical"
  ),
  publication_date: Joi.date(),
  publisher: Joi.string(),
  price: Joi.number().min(0),
  summary: Joi.string(),
  isbn: Joi.string(),
});
