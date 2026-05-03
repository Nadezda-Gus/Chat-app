import { createRemoteJWKSet, jwtVerify } from "jose";
import config from "../config.js";
import AppError from "../utils/appError.js";

// Получаем JWKS (JSON Web Key Set) из Supabase для проверки подписей токенов
const JWKS = createRemoteJWKSet(
    new URL(`${config.supabase.url}/auth/v1/.well-known/jwks.json`),
);

// Издатель токена (issuer claim)
const ISSUER = `${config.supabase.url}/auth/v1`;

export default async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    // Проверяем, есть ли заголовок и начинается ли с "Bearer "
    if (!authHeader?.startsWith("Bearer ")) {
        return next(new AppError("Вы не авторизованы", 401));
    }

    // Извлекаем сам токен (отрезаем "Bearer ")
    const token = authHeader.slice(7).trim();

    try {
        // Проверяем и верифицируем JWT токен
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: ISSUER,
            audience: "authenticated",
        });

        // Сохраняем данные пользователя в req.user для дальнейшего использования
        req.user = payload;
        next(); // Передаём управление дальше
    } catch (err) {
        console.error("JWT verify error:", err.message);
        // Возвращаем ошибку авторизации
        return next(new AppError("Недействительный или истекший токен", 401));
    }
}