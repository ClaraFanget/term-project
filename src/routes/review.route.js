const router = require("express").Router();
const reviewController = require("../controllers/review.controller.js");
const validate = require("../middlewares/validate.js");
const authRequired = require("../middlewares/auth.js");
const activeUser = require("../middlewares/active-user.js");
const listQuery = require("../middlewares/list-query");

const { createReviewDTO, updateReviewDTO } = require("../dto/review.dto.js");

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         book_id:
 *           type: string
 *           example: "665f0d4452a6a62db90ef799"
 *         rating:
 *           type: number
 *           example: 4
 *
 *     CreateReviewDTO:
 *       type: object
 *       required:
 *         - rating
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *
 *     UpdateReviewDTO:
 *       type: object
 *       required:
 *         - rating
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 3
 */

/**
 * @swagger
 * /books/{id}/reviews:
 *   post:
 *     summary: Create a review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewDTO'
 *     responses:
 *       201:
 *         description: Review successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router.post(
  "/books/:id/reviews",
  authRequired,
  activeUser,
  validate(createReviewDTO),
  reviewController.createReview
);

/**
 * @swagger
 * /books/{id}/reviews:
 *   get:
 *     summary: Get reviews for a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Book not found
 */
router.get("/books/:id/reviews", listQuery, reviewController.getBookReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewDTO'
 *     responses:
 *       200:
 *         description: Review successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.patch(
  "/reviews/:id",
  authRequired,
  activeUser,
  validate(updateReviewDTO),
  reviewController.updateReview
);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review successfully deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.delete(
  "/reviews/:id",
  authRequired,
  activeUser,
  reviewController.deleteReview
);

module.exports = router;
