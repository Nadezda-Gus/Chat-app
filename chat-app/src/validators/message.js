import { z } from 'zod';

// Схема валидации для создания сообщения
export const createMessageSchema = z.object({
    content: z.string().min(1).max(2000), // текст сообщения: от 1 до 2000 символов
});