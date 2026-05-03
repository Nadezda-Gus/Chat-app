import { z } from 'zod';

// Схема валидации для создания комнаты
export const createdRoomSchema = z.object({
    name: z.string().min(1).max(100), // название: от 1 до 100 символов
});