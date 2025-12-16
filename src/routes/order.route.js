const router = require("express").Router();
const orderController = require("../controllers/order.controller.js");
const validate = require("../middlewares/validate.js");
const authRequired = require("../middlewares/auth.js");
const adminOnly = require("../middlewares/admin.js");
const activeUser = require("../middlewares/active-user.js");
const listQuery = require("../middlewares/list-query");
const { createOrderDTO, updateOrderStatusDTO } = require("../dto/order.dto.js");

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         coupon_id:
 *           type: string
 *           nullable: true
 *           example: "665f0d4452a6a62db90ef799"
 *         total_amount:
 *           type: number
 *           example: 49.99
 *         status:
 *           type: string
 *           enum: [ordered, in preparation, shipped, received]
 *
 *     CreateOrderDTO:
 *       type: object
 *       required:
 *         - total_amount
 *       properties:
 *         total_amount:
 *           type: number
 *           example: 49.99
 *         coupon_id:
 *           type: string
 *           example: "665f0d4452a6a62db90ef799"
 *
 *     UpdateOrderStatusDTO:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [ordered, in preparation, shipped, received]
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderDTO'
 *     responses:
 *       201:
 *         description: Order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authRequired,
  activeUser,
  validate(createOrderDTO),
  orderController.createOrder
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get authenticated user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */
router.get("/", listQuery, authRequired, activeUser, orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authRequired, activeUser, orderController.getOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusDTO'
 *     responses:
 *       200:
 *         description: Order status successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/:id/status",
  authRequired,
  adminOnly,
  validate(updateOrderStatusDTO),
  orderController.updateOrderStatus
);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order successfully deleted
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authRequired, adminOnly, orderController.deleteOrder);

module.exports = router;
