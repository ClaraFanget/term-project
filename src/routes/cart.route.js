const router = require("express").Router();
const cartController = require("../controllers/cart.controller.js");
const validate = require("../middlewares/validate.js");
const authRequired = require("../middlewares/auth.js");
const activeUser = require("../middlewares/active-user.js");
const listQuery = require("../middlewares/list-query");
const { addCartItemDTO, updateCartItemDTO } = require("../dto/cart.dto.js");

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user_id:
 *           type: string
 *         total_amount:
 *           type: number
 *
 *     CartItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         book_id:
 *           type: string
 *         quantity:
 *           type: number
 *
 *     AddCartItemDTO:
 *       type: object
 *       required:
 *         - book_id
 *         - quantity
 *       properties:
 *         book_id:
 *           type: string
 *         quantity:
 *           type: number
 *
 *     UpdateCartItemDTO:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: number
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get authenticated user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart with items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authRequired, listQuery, activeUser, cartController.getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add a book to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCartItemDTO'
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/items",
  authRequired,
  activeUser,
  validate(addCartItemDTO),
  cartController.addCartItem
);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemDTO'
 *     responses:
 *       200:
 *         description: Cart item updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.patch(
  "/items/:itemId",
  authRequired,
  activeUser,
  validate(updateCartItemDTO),
  cartController.updateCartItem
);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     summary: Remove an item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.delete(
  "/items/:itemId",
  authRequired,
  activeUser,
  cartController.deleteCartItem
);

module.exports = router;
