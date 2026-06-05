import * as authService from '../services/authService.js'

// Контроллер регистрации
export async function register(req, res, next) {
    try {
        // Получаем данные из тела запроса
        const { email, password, name } = req.body
        // Вызываем сервис регистрации
        const { user, session } = await authService.register(email, password, name)
        // Отправляем ответ с пользователем и сессией
        res.status(200).json({ user, session })
    } catch (error) {
        next(error) // Передаём ошибку в errorHandler
    }
}

// Контроллер входа
export async function login(req, res, next) {
    try {
        // Получаем email и пароль
        const { email, password } = req.body
        // Вызываем сервис логина
        const { session } = await authService.login(email, password)
        // Отправляем токены сессии
        res.status(200).json({ session })
    } catch (error) {
        next(error)
    }
}

// Контроллер выхода
export async function logout(req, res, next) {
    try {
        // Извлекаем токен из заголовка Authorization (Bearer token)
        const token = req.headers.authorization.split(' ')[1]
        await authService.logout(token);
        // Ответ об успешном выходе
        res.status(200).json({ message: 'Выход выполнен' })
    } catch (error) {
        next(error)
    }
}

// Контроллер для получения данных текущего пользователя
export async function getMe(req, res, next) {
    try {
        // Получаем данные пользователя через сервис аутентификации, передавая Supabase ID из req.user
        const user = await authService.getMe(req.user.sub)
        // Отправляем успешный ответ с данными пользователя
        res.status(200).json({ user })
    } catch (error) {
        // Передаем ошибку в middleware обработки ошибок
        next(error)
    }
}