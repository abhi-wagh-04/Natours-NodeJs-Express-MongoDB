import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import AppError from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';

const app = express();
//////////////////////////////////////////////  Middleware   /////////////////////////////////////////////////////////
app.use(morgan('dev'));
// middleware for accessing request body
app.use(express.json());

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
