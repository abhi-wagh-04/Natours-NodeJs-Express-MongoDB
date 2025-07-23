import express from 'express';
import { isLoggedIn } from '../controllers/authController.js';
import {
  getOverview,
  getTour,
  getLoginForm,
} from '../controllers/viewsController.js';

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

export default router;
