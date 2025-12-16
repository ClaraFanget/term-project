const router = require("express").Router();
const bookController = require("../controllers/book.controller.js");
const validate = require("../middlewares/validate.js");
const authRequired = require("../middlewares/auth.js");
const adminOnly = require("../middlewares/admin.js");
const listQuery = require("../middlewares/list-query");
const cache = require("../middlewares/cache");

const { createBookDTO, updateBookDTO } = require("../dto/book.dto.js");

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "The Great Gatsby"
 *         author:
 *           type: string
 *           example: "F. Scott Fitzgerald"
 *         publication_date:
 *           type: date
 *           example: 1925-04-10
 *         literary_genre:
 *           type: string
 *           enum: ["fantasy","horror","mystery","romance","science fiction","dystopian","biography","drama","fable","poetry","historical"]
 *           example: "fantasy"
 *         summary:
 *           type: string
 *           example: "lorem ipsum"
 *         publisher:
 *           type: string
 *           example: Scribner
 *         price:
 *           type: number
 *           example: 19.99
 *         isbn:
 *           type: string
 *           example: 9780192633361
 */
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Book"
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Book"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.post(
  "/",
  authRequired,
  adminOnly,
  validate(createBookDTO),
  bookController.createBook
);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Books successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Book"
 */
router.get(
  "/",
  listQuery,
  cache((req) => `books:${JSON.stringify(req.query)}`, 60),
  bookController.getBooks
);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Book"
 *       404:
 *         description: Book not found
 */
router.get("/:id", bookController.getBook);

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Update a book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Book"
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.patch(
  "/:id",
  authRequired,
  adminOnly,
  validate(updateBookDTO),
  bookController.updateBook
);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.delete("/:id", authRequired, adminOnly, bookController.deleteBook);

module.exports = router;
