import { z } from "zod"
import AppError from "../utils/appError.js";

// Middleware для валидации данных запроса
export function validate(schema) {
    return (req, res, next) => {
        // Проверяем req.body по переданной схеме
        const result = schema.safeParse(req.body)

        if (!result.success) {
            // Если ошибка - возвращаем первое сообщение об ошибке
            return next(new AppError(result.error.errors[0].message, 400));
        }

        // Если всё ок - заменяем req.body на валидированные данные
        req.body = result.data
        next();
    };
}

// Схема регистрации
export const registerSchema = z.object({
    email: z.email(), // Обязательный email
    password: z.string().min(8), // Минимум 8 символов
    name: z.string().min(1).optional(), // Необязательное имя
});

// Схема входа
export const loginSchema = z.object({
    email: z.email(), // Обязательный email
    password: z.string().min(8), // Минимум 8 символов
});

router.post('/logout', authenticate, authController.logout)
router.get('/me', authenticate, authController.getMe)