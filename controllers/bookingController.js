import Stripe from 'stripe';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Tour from '../models/tourModel.js';
import Booking from '../models/bookingModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100, // in cents
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

export const createBookingCheckout = (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
};

export const createBooking = createOne(Booking);
export const getBooking = getOne(Booking);
export const getAllBookings = getAll(Booking);
export const updateBooking = updateOne(Booking);
export const deleteBooking = deleteOne(Booking);
