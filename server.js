import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Handling uncaught errors inside synchronous code
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 🧨 Shutting down....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!!'));

const port = 3000;
const server = app.listen(port, () => {
  console.log('App is listening on port 3000 .... ');
});

// Unhandled Rejection Promises --> Async code which weren't handled previously
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 🧨 Shutting down....');
  server.close(() => {
    process.exit(1);
  });
});
