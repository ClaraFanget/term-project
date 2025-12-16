const admin = require("../config/firebase");

const firebaseAuthRequired = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "fail",
        message: "Firebase token required",
      });
    }

    const token = header.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired Firebase token",
    });
  }
};

module.exports = firebaseAuthRequired;
