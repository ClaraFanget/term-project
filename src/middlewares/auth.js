const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const authRequired = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "fail",
        message: "Authentication required",
      });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    req.user = {
      id: user._id,
      is_admin: user.is_admin,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token",
    });
  }
};

module.exports = authRequired;
