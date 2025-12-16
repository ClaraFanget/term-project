const Coupon = require("../models/coupon.model.js");
const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");
const paginatedResponse = require("../utils/paginated-response");

const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create({
      ...req.body,
      created_by: req.user.id,
    });

    res.status(201).json({
      status: "success",
      message: "Coupon successfully created",
      data: coupon,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const getCoupons = async (req, res) => {
  try {
    const { page, size, offset, sortField, sortDirection } = req.listQuery;

    const query = {};

    const totalElements = await Coupon.countDocuments(query);

    const coupons = await Coupon.find(query)
      .sort({ [sortField]: sortDirection === "ASC" ? 1 : -1 })
      .skip(offset)
      .limit(size);

    res.status(200).json({
      status: "success",
      message: "Coupons successfully retrieved",
      data: paginatedResponse({
        content: coupons,
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

const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Coupon not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Coupon successfully updated",
      data: coupon,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Coupon not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Coupon successfully deleted",
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

module.exports = { createCoupon, getCoupons, updateCoupon, deleteCoupon };
