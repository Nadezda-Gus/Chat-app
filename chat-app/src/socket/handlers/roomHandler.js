// Импорт сервиса для работы с комнатами
import * as roomService from "../services/roomService.js";
// Импорт клиента Prisma для работы с БД
import prisma from "../../prisma/prismaClient.js";
// Импорт утилиты для получения пользователя по Supabase ID
import { getUserBySupabaseId } from "../../utils/socketUtils.js";

// Обработчик присоединения к комнате
export function handleJoinRoom(socket, chatNamespace) {
    return async (roomId) => {
        try {
            // Получаем пользователя из БД по Supabase ID
            const user = await getUserBySupabaseId(socket.data.user.sub);

            // Добавляем пользователя в комнату через сервис
            await roomService.joinRoom(roomId, socket.data.user.sub);

            // Подписываем сокет на комнату
            socket.join(roomId);

            // Получаем список всех участников комнаты
            const members = await prisma.roomMember.findMany({
                where: { roomId },
                include: { user: { select: { id: true, name: true, email: true } } },
            });

            // Отправляем текущему пользователю список участников
            socket.emit("room:users", members.map((m) => m.user));

            // Уведомляем остальных участников о подключении нового пользователя
            socket.to(roomId).emit("user:online", {
                userId: userId, // ОШИБКА: переменная userId не определена, нужно user.id
                username: user.name || user.email,
            });

            // Подтверждаем присоединение текущему пользователю
            socket.emit("room:joined", { roomId });
        } catch (error) {
            // Отправляем ошибку пользователю
            socket.emit("error", { message: error.message });
        }
    };
}

// Обработчик выхода из комнаты
export function handleLeaveRoom(socket, chatNamespace) {
    return async (roomId) => {
        try {
            // Получаем пользователя из БД по Supabase ID
            const user = await getUserBySupabaseId(socket.data.user.sub);

            // Проверяем, находится ли пользователь в этой комнате
            const member = await prisma.roomMember.findUnique({
                where: { userId_roomId: { userId: user.id, roomId } },
            });

            // Если не в комнате - отклоняем выход
            if (!member) {
                return socket.emit("error", { message: "Вы не в этой комнате" });
            }

            // Удаляем пользователя из комнаты через сервис
            await roomService.leaveRoom(roomId, socket.data.user.sub);

            // Отписываем сокет от комнаты
            socket.leave(roomId);

            // Уведомляем остальных участников о выходе пользователя
            socket.to(roomId).emit("user:offline", {
                userId: user.id,
                username: user.name || user.email,
            });

            // Подтверждаем выход текущему пользователю
            socket.emit("room:left", { roomId });
        } catch (error) {
            // Отправляем ошибку пользователю
            socket.emit("error", { message: error.message });
        }
    };
}