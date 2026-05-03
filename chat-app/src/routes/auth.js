import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';
import { validate, registerSchema, loginSchema } from '../validators/auth.js';

const router = Router();

// Маршрут регистрации (с валидацией данных)
router.post('/register', validate(registerSchema), authController.register);

// Маршрут входа (с валидацией данных)
router.post('/login', validate(loginSchema), authController.login);

// Маршрут выхода (требует авторизации)
router.post('/logout', authenticate, authController.logout);

export default router; // Экспорт роутера