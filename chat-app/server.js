import "dotenv/config"; // Загрузка переменных окружения из .env
import app from "../src/app.js";
import config from "../src/config.js";

// Функция запуска сервера
const startServer = async () => {
    try {
        // Запускаем сервер на указанном порту
        app.listen(config.port, () => {
            console.log(`Сервер запущен на порту http://localhost:${config.port}`);
            console.log(
                `Документация доступна на http://localhost:${config.port}/api/docs`,
            );
        });
    } catch (err) {
        console.error("Не удалось запустить сервер:", err);
    }
};

// Запускаем сервер
startServer();