import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  // Create Error if user POSTS password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates! Please use /updateMyPassword',
        400
      )
    );
  }
  // Filtered out unwanted fields names that are allowed to be updated
  const filterdBody = filterObj(req.body, 'name', 'email');

  // Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {});

export const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!',
  });
};

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!',
  });
};

export const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!',
  });
};

export const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!',
  });
};
