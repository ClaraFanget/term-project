const redisClient = require("../config/redis");
const Book = require("../models/book.model.js");
const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");
const paginatedResponse = require("../utils/paginated-response");

const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    const keys = await redisClient.keys("books:*");
    if (keys.length) {
      await redisClient.del(keys);
    }

    res.status(201).json({
      status: "success",
      message: "Book successfully created",
      data: book,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const getBooks = async (req, res) => {
  try {
    const { page, size, offset, sortField, sortDirection } = req.listQuery;

    const cacheKey = `books:${JSON.stringify(req.listQuery)}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        status: "success",
        message: "Books successfully retrieved",
        source: "cache",
        data: JSON.parse(cached),
      });
    }

    const query = {};

    const totalElements = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort({ [sortField]: sortDirection === "ASC" ? 1 : -1 })
      .skip(offset)
      .limit(size);

    const response = paginatedResponse({
      content: books,
      page,
      size,
      totalElements,
      sortField,
      sortDirection,
    });

    await redisClient.setEx(cacheKey, 60, JSON.stringify(response));

    return res.status(200).json({
      status: "success",
      message: "Books successfully retrieved",
      source: "database",
      data: response,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const getBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const cacheKey = `book:${bookId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        status: "success",
        message: "Book successfully retrieved",
        source: "cache",
        data: JSON.parse(cached),
      });
    }
    const book = await Book.findById(req.params.id);

    if (!book) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Book not found"));
    }
    await redisClient.setEx(cacheKey, 60, JSON.stringify(book));
    res.status(200).json({
      status: "success",
      message: "Book successfully retrieved",
      source: "database",
      data: book,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!book) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Book not found"));
    }

    await redisClient.del(`book:${req.params.id}`);
    const keys = await redisClient.keys("books:*");
    if (keys.length) {
      await redisClient.del(keys);
    }

    res.status(200).json({
      status: "success",
      message: "Book successfully updated",
      data: book,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);

    if (!deleted) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Book not found"));
    }

    await redisClient.del(`book:${req.params.id}`);

    const keys = await redisClient.keys("books:*");
    if (keys.length) {
      await redisClient.del(keys);
    }

    res.status(200).json({
      status: "success",
      message: "Book successfully deleted",
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
};
