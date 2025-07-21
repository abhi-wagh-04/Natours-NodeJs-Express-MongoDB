import express from 'express';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setTouUserIds,
  updateReview,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTouUserIds, createReview);

router
  .route('/:id')
  .get(protect, getReview)
  .patch(protect, updateReview)
  .delete(deleteReview);

export default router;
