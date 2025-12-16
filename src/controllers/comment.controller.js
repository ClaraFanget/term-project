const Comment = require("../models/comment.model.js");
const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");
const paginatedResponse = require("../utils/paginated-response");

const createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      review_id: req.params.id,
      user_id: req.user.id,
      comment: req.body.comment,
    });

    res.status(201).json({
      status: "success",
      message: "Comment successfully created",
      data: comment,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const getReviewComments = async (req, res) => {
  try {
    const { page, size, offset, sortField, sortDirection } = req.listQuery;

    const query = { review_id: req.params.id };

    const totalElements = await Comment.countDocuments(query);

    const comments = await Comment.find(query)
      .sort({ [sortField]: sortDirection === "ASC" ? 1 : -1 })
      .skip(offset)
      .limit(size);

    res.status(200).json({
      status: "success",
      message: "Comments successfully retrieved",
      data: paginatedResponse({
        content: comments,
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

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Comment not found"));
    }

    if (req.user.id !== comment.user_id.toString() && !req.user.is_admin) {
      const err = errorCodes.UNAUTHORIZED;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Unauthorized"));
    }

    await comment.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Comment successfully deleted",
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const existingComment = await Comment.findById(id);
    if (!existingComment) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Comment not found"));
    }

    if (
      existingComment.user_id.toString() !== req.user.id &&
      !req.user.is_admin
    ) {
      const err = errorCodes.UNAUTHORIZED;
      return res
        .status(err.status)
        .json(
          errorResponse(
            req,
            err,
            null,
            "You are not allowed to update this comment"
          )
        );
    }

    existingComment.comment = comment;
    await existingComment.save();

    res.status(200).json({
      status: "success",
      message: "Comment updated successfully",
      data: existingComment,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

module.exports = {
  createComment,
  getReviewComments,
  deleteComment,
  updateComment,
};
