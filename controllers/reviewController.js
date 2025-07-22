import Review from '../models/reviewModel.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

export const getAllReviews = getAll(Review);
export const getReview = getOne(Review, 'users');

export const setTouUserIds = (req, res, next) => {
  // Allowed Nested Routes
  if (!req.body.tour) req.body.tours = req.params.tourId;
  if (!req.body.user) req.body.users = req.user.id;

  next();
};

export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
