const adminOnly = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({
      status: "fail",
      message: "Access denied. Admin only.",
    });
  }
  next();
};

module.exports = adminOnly;
