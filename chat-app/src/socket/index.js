// Импорт middleware для аутентификации сокетов
import socketAuthenticate from "./authenticate.js";
// Импорт обработчиков комнат
import {
    handleJoinRoom,
    handleLeaveRoom,
} from "./handlers/roomHandler.js";
// Импорт обработчиков сообщений и отключения
import {
    handleSendMessage,
    handleDisconnect,
} from "./handlers/messageHandler.js";

// Функция инициализации Socket.IO сервера
export default function initializeSocket(io) {
    // Создаём пространство имён "/chat"
    const chatNamespace = io.of("/chat");

    // Применяем аутентификацию ко всем подключениям в этом пространстве
    chatNamespace.use((socket, next) => {
        socketAuthenticate(socket, next);
    });

    // Обработчик новых подключений
    chatNamespace.on("connection", (socket) => {
        // Событие: присоединение к комнате
        socket.on("room:join", handleJoinRoom(socket, chatNamespace));

        // Событие: выход из комнаты
        socket.on("room:leave", handleLeaveRoom(socket, chatNamespace));

        // Событие: отправка сообщения
        socket.on("message:send", handleSendMessage(socket, chatNamespace));

        // Событие: отключение клиента
        socket.on("disconnect", handleDisconnect(socket, chatNamespace));

        // Обработчик ошибок сокета (пустой, чтобы подавить ошибки)
        socket.on("error", (error) => {
            return; // Игнорируем ошибки
        });
    });
}