// Импорт функций для работы с JWT токенами
import { createRemoteJWKSet, jwtVerify } from "jose";
// Импорт конфигурации приложения
import config from "../config.js";

// Создание удалённого набора JWK (JSON Web Keys) для верификации подписи токенов Supabase
const JWKS = createRemoteJWKSet(
    new URL(`${config.supabase.url}/auth/v1/.well-known/jwks.json`),
);

// Издатель токенов (Supabase Auth)
const ISSUER = `${config.supabase.url}/auth/v1`;

// Middleware для аутентификации Socket.IO соединения
export default async function socketAuthenticate(socket, next) {
    // Извлекаем токен из handshake auth
    const token = socket.handshake.auth.token;

    // Проверка наличия токена
    if (!token) {
        return next(new Error("Token не предоставлен"));
    }

    try {
        // Верифицируем JWT токен с помощью удалённого JWKS
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: ISSUER,           // Проверяем издателя
            audience: "authenticated", // Проверяем аудиторию
        });

        // Сохраняем payload (данные пользователя) в socket.data
        socket.data.user = payload;
        next(); // Успешная аутентификация
    } catch (err) {
        // Ошибка верификации токена
        return next(new Error("Недействительный или истёкший токен"));
    }
}