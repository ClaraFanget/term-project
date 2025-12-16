const router = require("express").Router();
const couponController = require("../controllers/coupon.controller.js");
const validate = require("../middlewares/validate.js");
const authRequired = require("../middlewares/auth.js");
const adminOnly = require("../middlewares/admin.js");
const listQuery = require("../middlewares/list-query");
const { createCouponDTO, updateCouponDTO } = require("../dto/coupon.dto.js");

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f0d4152a6a62db90ef7021"
 *         code:
 *           type: string
 *           example: "WELCOME10"
 *         discount_rate:
 *           type: 10
 *         start_at:
 *           type: date
 *           example: 2026-01-01
 *         end_at:
 *           type: date
 *           example: 2026-01-03
 *         is_valid:
 *           type: boolean
 *           example: false
 *
 *     CreateCouponDTO:
 *       type: object
 *       required:
 *         - code
 *         - discount_rate
 *         - start_at
 *         - end_at
 *         - is_valid
 *       properties:
 *         code:
 *           type: string
 *           example: "SUMMER20"
 *         discount_rate:
 *           type: number
 *           example: 20
 *         start_at:
 *           type: string
 *           example: 2026-01-01
 *         end_at:
 *           type: string
 *           example: 2026-01-04
 *         is_valid:
 *           type: boolean
 *           example: false
 *
 *     UpdateCouponDTO:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: "HELLO50"
 *         discount_rate:
 *           type: number
 *           example: 50
 *         start_at:
 *           type: date
 *           example: 2026-01-01
 *         end_at:
 *           type: date
 *           example: 2026-02-02
 *         is_valid:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCouponDTO'
 *     responses:
 *       201:
 *         description: Coupon successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
router.post(
  "/",
  authRequired,
  adminOnly,
  validate(createCouponDTO),
  couponController.createCoupon
);

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
router.get(
  "/",
  authRequired,
  listQuery,
  adminOnly,
  couponController.getCoupons
);

/**
 * @swagger
 * /coupons/{id}:
 *   patch:
 *     summary: Update a coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCouponDTO'
 *     responses:
 *       200:
 *         description: Coupon successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Coupon not found
 */
router.patch(
  "/:id",
  authRequired,
  adminOnly,
  validate(updateCouponDTO),
  couponController.updateCoupon
);

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Delete a coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Coupon not found
 */
router.delete("/:id", authRequired, adminOnly, couponController.deleteCoupon);

module.exports = router;
