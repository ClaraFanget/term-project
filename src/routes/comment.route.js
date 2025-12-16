const router = require("express").Router();
const commentController = require("../controllers/comment.controller.js");
const validate = require("../middlewares/validate.js");
const authRequired = require("../middlewares/auth.js");
const listQuery = require("../middlewares/list-query");
const activeUser = require("../middlewares/active-user.js");
const { createCommentDTO, updateCommentDTO } = require("../dto/comment.dto.js");

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         review_id:
 *           type: string
 *         user_id:
 *           type: string
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCommentDTO:
 *       type: object
 *       required:
 *         - comment
 *       properties:
 *         comment:
 *           type: string
 *           example: "Great review, totally agree!"
 *     UpdateCommentDTO:
 *       type: object
 *       required:
 *         - comment
 *       properties:
 *         comment:
 *           type: string
 *           example: "Updated comment content"
 */

/**
 * @swagger
 * /reviews/{id}/comments:
 *   post:
 *     summary: Create a comment on a review
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentDTO'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.post(
  "/reviews/:id/comments",
  authRequired,
  activeUser,
  validate(createCommentDTO),
  commentController.createComment
);

/**
 * @swagger
 * /reviews/{id}/comments:
 *   get:
 *     summary: Get all comments for a review
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Review not found
 */
router.get(
  "/reviews/:id/comments",
  listQuery,
  commentController.getReviewComments
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 */
router.delete(
  "/comments/:id",
  authRequired,
  activeUser,
  commentController.deleteComment
);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentDTO'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 */
router.patch(
  "/comments/:id",
  authRequired,
  activeUser,
  validate(updateCommentDTO),
  commentController.updateComment
);

module.exports = router;
