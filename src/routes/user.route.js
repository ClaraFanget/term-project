const router = require("express").Router();
const userController = require("../controllers/user.controller.js");
const validate = require("../middlewares/validate.js");
const authRequired = require("../middlewares/auth.js");
const adminOnly = require("../middlewares/admin.js");
const activeUser = require("../middlewares/active-user.js");
const listQuery = require("../middlewares/list-query.js");

const { createUserDTO, updateMeDTO } = require("../dto/user.dto.js");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Doe"
 *         birth_date:
 *           type: string
 *           format: date
 *           example: "1990-05-12"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         gender:
 *           type: string
 *           enum: [female, male, other]
 *           example: "male"
 *         address:
 *           type: string
 *           example: "10 rue de Paris"
 *         phone_number:
 *           type: string
 *           example: "0601020304"
 *
 *     UpdateMeDTO:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           example: "12 rue Molière"
 *
 *     DeactivateUserDTO:
 *       type: object
 *       required:
 *         - is_active
 *       properties:
 *         is_active:
 *           type: boolean
 *           example: false
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 */
router.post("/", validate(createUserDTO), userController.createUser);

/**
 * @swagger
 * /users/admin/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Grant admin rights to an existing user
 *     description: >
 *       This route allows an administrator to give admin privileges to an existing user.
 *       Only authenticated admins can access this route.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Admin privilege granted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin rights granted"
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "678c9b3a23d78b1cda345f12"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     is_admin:
 *                       type: boolean
 *                       example: true
 *       "400":
 *         description: User is already an admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is already an admin"
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       "401":
 *         description: Unauthorized - Missing or invalid token.
 *       "403":
 *         description: Forbidden - Only admins can perform this action.
 *       "500":
 *         description: Server error.
 */
router.patch(
  "/admin/:id",
  authRequired,
  adminOnly,
  userController.grantAdminRole
);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authRequired, activeUser, userController.getMe);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeDTO'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/me",
  authRequired,
  activeUser,
  validate(updateMeDTO),
  userController.updateMe
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.get("/", listQuery, authRequired, adminOnly, userController.getUsers);

/**
 * @swagger
 * /users/{id}/deactivate:
 *   delete:
 *     summary: Deactivate a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.delete(
  "/:id/deactivate",
  authRequired,
  adminOnly,
  userController.deactivateUser
);

module.exports = router;
