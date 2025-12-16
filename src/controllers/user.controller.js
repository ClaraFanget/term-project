const User = require("../models/user.model.js");
const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");

const paginatedResponse = require("../utils/paginated-response");

const getUsers = async (req, res) => {
  try {
    const { page, size, offset, sortField, sortDirection, filters } =
      req.listQuery;

    const query = {};

    if (filters.keyword) {
      query.username = { $regex: filters.keyword, $options: "i" };
    }

    if (filters.role) {
      query.role = filters.role;
    }

    const totalElements = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({ [sortField]: sortDirection === "ASC" ? 1 : -1 })
      .skip(offset)
      .limit(size);

    res.status(200).json({
      status: "success",
      message: "Users successfully retrieved",
      data: paginatedResponse({
        content: users,
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

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "User not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Profile successfully retrieved",
      data: user,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const createUser = async (req, res) => {
  try {
    const { email, phone_number } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({
        status: "error",
        code: "DUPLICATE_EMAIL",
        message: "Email already exists",
      });
    }

    const phoneExists = await User.findOne({ phone_number });
    if (phoneExists) {
      return res.status(409).json({
        status: "error",
        code: "DUPLICATE_PHONE_NUMBER",
        message: "Phone number already exists",
      });
    }
    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      status: "success",
      message: "User successfully created",
      data: user,
    });
  } catch (error) {
    console.error(error);
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const updateMe = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });

    if (!updated) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "User not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Profile successfully updated",
      data: updated,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const deactivateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );

    if (!updated) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "User not found"));
    }

    res.status(200).json({
      status: "success",
      message: "User successfully deactivated",
      data: updated,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const deleteUsers = async (req, res) => {
  try {
    await User.deleteMany({});

    res.status(200).json({
      status: "success",
      message: "All users successfully deleted",
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const grantAdminRole = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "User not found"));
    }

    if (user.is_admin === true) {
      const err = errorCodes.CONFLICT;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "User is already an admin "));
    }

    user.is_admin = true;
    await user.save();

    res.status(200).json({
      message: "Admin rights granted",
      admin: {
        id: user._id,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

module.exports = {
  getUsers,
  getMe,
  createUser,
  updateMe,
  deactivateUser,
  deleteUsers,
  grantAdminRole,
};
