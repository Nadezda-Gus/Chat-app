import prisma from '../.../prisma/prismaClient.js';
import AppError from '../.../utils/appError.js';

// Вспомогательная функция: получить пользователя по supabaseId
async function getUserBySupabaseId(supabaseId) {
    const user = await prisma.user.findUnique({ where: { supabaseId } });
    if (!user) throw new AppError('Пользователь не найден', 404);
    return user;
}

// Получить все сообщения в комнате
export async function getMessages(roomId) {
    // Проверяем, существует ли комната
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError('Комната не найдена', 404);

    // Возвращаем сообщения (старые сверху, новые снизу)
    return prisma.message.findMany({
        where: { roomId },
        orderBy: { createdAt: 'asc' }, // asc = сначала старые
        include: { sender: { select: { id: true, name: true, email: true } } }, // данные отправителя
    });
}

// Создать новое сообщение в комнате
export async function createMessage(roomId, supabaseId, content) {
    // Получаем пользователя
    const user = await getUserBySupabaseId(supabaseId);

    // Проверяем, является ли пользователь участником комнаты
    const member = await prisma.roomMember.findUnique({
        where: { userId: user.id, roomId: roomId }
    });
    if (!member) throw new AppError('Вы не являетесь участником этой комнаты', 403);

    // Создаём сообщение
    return prisma.message.create({
        data: { roomId, senderId: user.id, content },
        include: { sender: { select: { id: true, name: true, email: true } } }, // возвращаем с данными отправителя
    });
}