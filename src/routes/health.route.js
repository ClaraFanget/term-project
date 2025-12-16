const express = require("express");
const router = express.Router();
const { healthCheck } = require("../controllers/health.controller");

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: >
 *       Returns the health status of the API and its dependencies.
 *       This endpoint does not require authentication and can be used
 *       for monitoring and uptime checks.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API and services are healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-12-16T08:15:00.123Z
 *                 services:
 *                   type: object
 *                   properties:
 *                     api:
 *                       type: string
 *                       example: up
 *                     database:
 *                       type: string
 *                       example: up
 *                     redis:
 *                       type: string
 *                       example: up
 *       500:
 *         description: One or more services are unavailable
 */
router.get("/health", healthCheck);

module.exports = router;
