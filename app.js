import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRouter.js';
import AppError from './utils/appError.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { globalErrorHandler } from './controllers/errorController.js';

const app = express();
//////////////////////////////////////////////  Middleware   /////////////////////////////////////////////////////////
// Set security HTTP headers
app.use(helmet());

// Devlopment logging
app.use(morgan('dev'));

// Rate Limiter --> To limit numberof requests from 1 IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// middleware for accessing request body && payload limit
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Static files
app.use(express.static('./public'));

// Custom middleware --> This middleware is applied to all the requests
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/////////////////////////////////////////  Routes   //////////////////////////////////////////////////////////////////////
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handling Unhandled Routes
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 404));
});

// Error hnadling middleware
app.use(globalErrorHandler);

export default app;
