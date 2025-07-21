import Review from '../models/reviewModel.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { createOne, deleteOne, updateOne } from './handlerFactory.js';

export const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tours: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});

export const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new AppError(
        `Can't find the review with following id: ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

export const setTouUserIds = (req, res, next) => {
  // Allowed Nested Routes
  if (!req.body.tour) req.body.tours = req.params.tourId;
  if (!req.body.user) req.body.users = req.user.id;

  next();
};

export const createReview = createOne(Review);

export const updateReview = updateOne(Review);

export const deleteReview = deleteOne(Review);
