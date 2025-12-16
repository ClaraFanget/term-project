const router = require("express").Router();
const favoriteController = require("../controllers/favorite.controller.js");
const authRequired = require("../middlewares/auth.js");
const activeUser = require("../middlewares/active-user.js");
const listQuery = require("../middlewares/list-query");

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           example: "65f0d4452a6a62db90ef7001"
 *         book_id:
 *           type: object
 *           description: Book object
 */

/**
 * @swagger
 * /{id}/favorite:
 *   post:
 *     summary: Add a book to the authenticated user's favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book ID to add to favorites
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Book added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Invalid book ID
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Book already in favorites
 */
router.post(
  "/:id/favorite",
  authRequired,
  activeUser,
  favoriteController.addFavorite
);

/**
 * @swagger
 * /{id}/favorite:
 *   delete:
 *     summary: Remove a book from the authenticated user's favorites
 *     tags: [Favorites]
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
 *         description: Book removed from favorites successfully
 *       400:
 *         description: Invalid book ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Favorite not found
 */
router.delete(
  "/:id/favorite",
  authRequired,
  activeUser,
  favoriteController.removeFavorite
);

/**
 * @swagger
 * /users/me/favorites:
 *   get:
 *     summary: Get the authenticated user's favorite books
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's favorite books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/users/me/favorites",
  listQuery,
  authRequired,
  activeUser,
  favoriteController.getMyFavorites
);

module.exports = router;
