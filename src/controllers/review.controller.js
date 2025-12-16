const Review = require("../models/review.model.js");
const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");
const paginatedResponse = require("../utils/paginated-response");

const createReview = async (req, res) => {
  try {
    const review = await Review.create({
      user_id: req.user.id,
      book_id: req.params.id,
      rating: req.body.rating,
    });

    res.status(201).json({
      status: "success",
      message: "Review successfully created",
      data: review,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const getBookReviews = async (req, res) => {
  try {
    const { page, size, offset, sortField, sortDirection } = req.listQuery;

    const query = { book_id: req.params.id };

    const totalElements = await Review.countDocuments(query);

    const reviews = await Review.find(query)
      .populate({
        path: "comments",
        populate: {
          path: "user_id",
          select: "name",
        },
      })
      .sort({ [sortField]: sortDirection === "ASC" ? 1 : -1 })
      .skip(offset)
      .limit(size);

    res.status(200).json({
      status: "success",
      message: "Reviews successfully retrieved",
      data: paginatedResponse({
        content: reviews,
        page,
        size,
        totalElements,
        sortField,
        sortDirection,
      }),
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!review) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Review not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Review successfully updated",
      data: review,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);

    if (!deleted) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Review not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Review successfully deleted",
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

module.exports = {
  createReview,
  getBookReviews,
  updateReview,
  deleteReview,
};
