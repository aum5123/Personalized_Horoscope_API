const express = require('express');
const { getTodayHoroscope, getHistory } = require('../controllers/horoscopeController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/horoscope/today:
 *   get:
 *     summary: Get today's horoscope
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's horoscope
 */
router.get('/today', authMiddleware, getTodayHoroscope);

/**
 * @swagger
 * /api/horoscope/history:
 *   get:
 *     summary: Get horoscope history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Last 7 days history
 */
router.get('/history', authMiddleware, getHistory);

module.exports = router;
