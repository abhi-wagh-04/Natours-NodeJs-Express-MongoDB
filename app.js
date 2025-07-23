import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRouter.js';
import viewRouter from './routes/viewRouter.js';
import AppError from './utils/appError.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import xss from 'xss-clean';
import { globalErrorHandler } from './controllers/errorController.js';
import { title } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//////////////////////////////////////////////  Middleware   /////////////////////////////////////////////////////////
// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
        connectSrc: [
          "'self'",
          'ws://127.0.0.1:60422', // ✅ Allow WebSocket from this port
        ],
      },
    },
  })
);

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
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Static files
app.use(express.static('./public'));

// Custom middleware --> This middleware is applied to all the requests
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/////////////////////////////////////////  Routes   //////////////////////////////////////////////////////////////////////
app.use('/', viewRouter);
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
