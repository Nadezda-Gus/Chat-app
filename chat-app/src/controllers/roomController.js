import * as roomService from '../services/roomService.js'

// Получить список всех комнат
export async function getRooms(req, res, next) {
    try {
        const rooms = await roomService.getRooms()
        res.status(200).json({ rooms }) // отправляем список комнат
    } catch (error) {
        next(error) // передаём ошибку в errorHandler
    }
}

// Контроллер для получения списка ID комнат текущего пользователя
export async function getMyRooms(req, res, next) {
    try {
        // Получаем ID комнат пользователя через сервис комнат, передавая Supabase ID из req.user
        const roomIds = await roomService.getMyRooms(req.user.sub)
        // Отправляем успешный ответ с массивом ID комнат
        res.status(200).json({ roomIds })
    } catch (error) {
        // Передаем ошибку в middleware обработки ошибок
        next(error)
    }
}

// Получить комнату по ID
export async function getRoomById(req, res, next) {
    try {
        const room = await roomService.getRoomById(req.params.id)
        res.status(200).json({ room }) // отправляем найденную комнату
    } catch (error) {
        next(error)
    }
}

// Создать новую комнату
export async function createRoom(req, res, next) {
    try {
        // req.user.sub - Supabase ID из JWT токена
        const room = await roomService.createRoom(req.body.name, req.user.sub)
        res.status(201).json({ room }) // 201 = Created
    } catch (error) {
        next(error)
    }
}

// Удалить комнату
export async function deleteRoom(req, res, next) {
    try {
        await roomService.deleteRoom(req.params.id)
        res.status(204).send() // 204 = No Content (успешно, тело ответа пустое)
    } catch (error) {
        next(error)
    }
}
