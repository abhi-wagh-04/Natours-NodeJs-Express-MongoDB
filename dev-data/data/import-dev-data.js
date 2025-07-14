import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../../models/tourModel.js';
import { readFileSync } from 'fs';

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

// Read File
const tours = JSON.parse(
  readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import Data to Database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully loaded');
  } catch (err) {
    console.log(err);
  }
};

//Delete all data from database
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Successfully loaded');
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);
