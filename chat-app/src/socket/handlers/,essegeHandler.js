// Импорт сервиса для работы с сообщениями
import * as messageService from "../../services/messageService.js";
// Импорт клиента Prisma для работы с БД
import prisma from "../../prisma/prismaClient.js";
// Импорт утилиты для получения пользователя по Supabase ID
import { getUserBySupabaseId } from "../../utils/socketUtils.js";

// Обработчик отправки сообщения
export function handleSendMessage(socket, chatNamespace) {
    return async (roomId, content) => {
        try {
            // Проверка: сообщение не должно быть пустым
            if (!content || content.trim() === "") {
                return socket.emit("error", { message: "Сообщение не может быть пустым" });
            }

            // Получаем пользователя из БД по Supabase ID
            const user = await getUserBySupabaseId(socket.data.user.sub);

            // Проверяем, является ли пользователь участником комнаты
            const member = await prisma.roomMember.findUnique({
                where: { userId_roomId: { userId: user.id, roomId } },
            });

            // Если не участник - отклоняем отправку
            if (!member) {
                return socket.emit("error", { message: "Вы не являетесь участником этой комнаты" });
            }

            // Создаём сообщение через сервис
            const message = await messageService.createMessage(
                roomId,
                socket.data.user.sub,
                content,
            );

            // Рассылаем сообщение всем в комнате
            chatNamespace.to(roomId).emit("message:receive", {
                id: message.id,
                content: message.content,
                senderId: message.sender.id,
                senderName: message.sender.name || message.sender.email,
                createdAt: message.createdAt,
                roomId,
            });
        } catch (error) {
            // Отправляем ошибку отправителю
            socket.emit("error", { message: error.message });
        }
    };
}

// Обработчик отключения сокета
export function handleDisconnect(socket, chatNamespace) {
    return async () => {
        try {
            const user = socket.data.user;
            if (user) {
                // Находим пользователя в БД
                const dbUser = await getUserBySupabaseId(user.sub);

                // Получаем все комнаты, где состоит пользователь
                const memberRooms = await prisma.roomMember.findMany({
                    where: { userId: dbUser.id },
                    select: { roomId: true },
                });

                // Для каждой комнаты уведомляем остальных участников об уходе пользователя
                for (const member of memberRooms) {
                    chatNamespace.to(member.roomId).emit("user:offline", {
                        userId: dbUser.id,
                        username: user.name || user.email,
                    });
                }
            }
        } catch (error) {
            // Игнорируем ошибки при отключении
            return;
        }
    };
}