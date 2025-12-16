const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const Cart = require("../models/cart.model.js");
const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "User not found"));
    }

    if (!user.is_active) {
      const err = errorCodes.FORBIDDEN;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Account is deactivated"));
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const err = errorCodes.UNAUTHORIZED;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Incorrect password"));
    }

    const accessToken = jwt.sign(
      { userId: user._id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    let cart = await Cart.findOne({ user_id: user.id });

    if (!cart) {
      cart = await Cart.create({ user_id: user._id, total_amount: 0 });
    }

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      const err = errorCodes.INVALID_BODY;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Refresh token required"));
    }

    const payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);

    const accessToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      message: "Token refreshed",
      accessToken,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.refresh_token = null;
    await user.save();

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      status: "success",
      message: "Logged out",
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

module.exports = { login, refresh, logout };
