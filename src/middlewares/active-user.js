const User = require("../models/user.model");

const checkActiveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.is_active) {
      return res.status(403).json({
        status: "fail",
        message: "Your account has been deactivated. Contact support.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = checkActiveUser;
