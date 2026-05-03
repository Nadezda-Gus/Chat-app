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

// Войти в комнату
export async function joinRoom(req, res, next) {
    try {
        await roomService.joinRoom(req.params.id, req.user.sub)
        res.status(200).json({ message: 'Вы вошли в комнату' }) // успех с сообщением
    } catch (error) {
        next(error)
    }
}

// Покинуть комнату
export async function leaveRoom(req, res, next) {
    try {
        await roomService.leaveRoom(req.params.id, req.user.sub)
        res.status(200).json({ message: 'Вы покинули комнату' }) // успех с сообщением
    } catch (error) {
        next(error)
    }
}