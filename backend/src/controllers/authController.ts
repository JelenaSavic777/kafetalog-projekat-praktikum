import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import { findAdminByUsername } from './usermodel';
import { signJwt } from '../utils/jwt';
import { validateRequest } from '../middlewares/validationMiddleware';

const router = Router();

router.post(
  '/login',
  body('username').isString().trim().notEmpty(),
  body('password').isString().notEmpty(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;

    try {
      const admin = await findAdminByUsername(username);
      if (!admin) {
        res.status(401).json({ message: 'Neispravno korisničko ime ili lozinka.' });
        return;  
      }

      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) {
        res.status(401).json({ message: 'Neispravno korisničko ime ili lozinka.' });
        return;  
      }

      const token = signJwt({ id: admin.id, username: admin.username }, '1h');
      res.json({ token });
      return; 
    } catch (error) {
      console.error('Login greška:', error);
      next(error);  
    }
  }
);

export default router;
