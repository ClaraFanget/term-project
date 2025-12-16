const router = require("express").Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller.js");
const firebaseAuthRequired = require("../middlewares/firebase-auth");
const validate = require("../middlewares/validate.js");
const authRequired = require("../middlewares/auth.js");
const { generateTokens } = require("../utils/jwt");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");

const { loginDTO, refreshDTO } = require("../dto/auth.dto.js");
/**
 * @swagger
 * /auth/firebase:
 *   post:
 *     summary: Firebase authentication
 *     description: >
 *       Authenticates a user using Firebase ID Token.
 *       The Firebase token must be provided in the Authorization header.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Firebase authentication successful
 *       401:
 *         description: Invalid Firebase token
 */
router.post("/firebase", firebaseAuthRequired, async (req, res, next) => {
  try {
    const { uid, email, firebase } = req.firebaseUser;

    if (!email) {
      return res.status(400).json({
        status: "fail",
        message: "Firebase user has no email",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        provider: "firebase",
        provider_id: uid,
        is_active: true,
      });
    }

    let cart = await Cart.findOne({ user_id: user._id });
    if (!cart) {
      cart = await Cart.create({
        user_id: user._id,
        total_amount: 0,
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return res.status(200).json({
      status: "success",
      message: "Firebase login successful",
      data: user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Authenticate user with Google OAuth
 *     description: >
 *       Initiates Google OAuth 2.0 authentication flow.
 *       This endpoint redirects the user to Google's consent screen.
 *       It cannot be fully tested via Swagger UI and must be accessed via a browser.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 *       500:
 *         description: Internal server error
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: >
 *       Callback endpoint used by Google OAuth 2.0 after user authentication.
 *       This route cannot be called directly from Swagger UI.
 *       If authentication is successful, the user is created (if not exists),
 *       a cart is initialized, and JWT access and refresh tokens are returned.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Google authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Google login successful
 *                 data:
 *                   type: object
 *                   description: Authenticated user
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f0c8e2b4a1c2d3e4f56789
 *                     email:
 *                       type: string
 *                       example: user@gmail.com
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     provider:
 *                       type: string
 *                       example: google
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized or Google authentication failed
 *       500:
 *         description: Internal server error
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;

      let cart = await Cart.findOne({ user_id: user._id });
      if (!cart) {
        cart = await Cart.create({
          user_id: user._id,
          total_amount: 0,
        });
      }

      const { accessToken, refreshToken } = generateTokens(user);

      return res.status(200).json({
        status: "success",
        message: "Google login successful",
        data: user,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@test.com
 *               password:
 *                 type: string
 *                 example: P@ssw0rd!
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginDTO), authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Token refreshed
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Refresh token required
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh", validate(refreshDTO), authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout the authenticated user
 *     description: >
 *       Invalide le refresh token de l'utilisateur en base de données et supprime
 *       le cookie HTTP-only `refresh_token`.
 *       Nécessite un token d'accès JWT valide via bearerAuth.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logged out
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.post("/logout", authRequired, authController.logout);

module.exports = router;
