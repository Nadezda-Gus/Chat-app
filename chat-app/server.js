import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import config from "./src/config.js";
import initializeSocket from "./src/socket/index.js";

// Функция запуска сервера
const startServer = async () => {
    try {
        // Создаём HTTP сервер на основе Express приложения
        const httpServer = createServer(app);

        // Создаём Socket.IO сервер с настройками CORS
        const io = new Server(httpServer, {
            cors: { origin: config.cors.origin },
        });

        // Сохраняем экземпляр io в app для использования в других частях приложения
        app.set("io", io);

        // Инициализируем обработчики сокетов
        initializeSocket(io);

        // Запускаем прослушивание порта
        httpServer.listen(config.port, () => {
            console.log(`Сервер запущен на порту http://localhost:${config.port}`);
            console.log(`Документация доступна на http://localhost:${config.port}/api/docs`);
        });
    } catch (err) {
        console.error("Не удалось запустить сервер:", err);
    }
};

// Запускаем сервер
startServer();