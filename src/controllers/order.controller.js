const Order = require("../models/order.model.js");
const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");
const paginatedResponse = require("../utils/paginated-response");

const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      user_id: req.user.id,
      coupon_id: req.body.coupon_id || null,
      total_amount: req.body.total_amount,
      status: "ordered",
    });

    res.status(201).json({
      status: "success",
      message: "Order successfully created",
      data: order,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const getOrders = async (req, res) => {
  try {
    const { page, size, offset, sortField, sortDirection, filters } =
      req.listQuery;

    const query = { user_id: req.user.id };

    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) {
        query.createdAt.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        query.createdAt.$lte = new Date(filters.dateTo);
      }
    }

    const totalElements = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ [sortField]: sortDirection === "ASC" ? 1 : -1 })
      .skip(offset)
      .limit(size);

    res.status(200).json({
      status: "success",
      message: "Orders successfully retrieved",
      data: paginatedResponse({
        content: orders,
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

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Order not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Order successfully retrieved",
      data: order,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Order not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Order status successfully updated",
      data: order,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Order not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Order successfully deleted",
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
};
