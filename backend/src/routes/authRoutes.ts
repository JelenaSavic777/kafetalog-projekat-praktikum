import authController from '../controllers/authController';
import { Router } from 'express';

const router = Router();

router.use('/', authController);

export default router;
