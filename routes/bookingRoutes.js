import express from 'express';
import { protect } from '../controllers/authController.js';
import { getCheckoutSession } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

export default router;
