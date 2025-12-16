const Favorite = require("../models/favorite.model.js");
const mongoose = require("mongoose");
const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");
const paginatedResponse = require("../utils/paginated-response");

const addFavorite = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid bookId",
      });
    }

    const favorite = await Favorite.create({
      user_id: req.user.id,
      book_id: req.params.id,
    });

    res.status(201).json({
      status: "success",
      message: "Book added to favorites",
      data: favorite,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const deleted = await Favorite.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!deleted) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Favorite not found"));
    }
    res.status(200).json({
      status: "success",
      message: "Favorite removed",
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const getMyFavorites = async (req, res) => {
  try {
    const { page, size, offset, sortField, sortDirection } = req.listQuery;

    const query = { user_id: req.user.id };

    const totalElements = await Favorite.countDocuments(query);

    const favorites = await Favorite.find(query)
      .populate("book_id")
      .sort({ [sortField]: sortDirection === "ASC" ? 1 : -1 })
      .skip(offset)
      .limit(size);

    res.status(200).json({
      status: "success",
      message: "Favorites successfully retrieved",
      data: paginatedResponse({
        content: favorites,
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

module.exports = { addFavorite, removeFavorite, getMyFavorites };
