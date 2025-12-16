const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
  if (!user || !user._id) {
    throw new Error("Invalid user for token generation");
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

  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
