import * as messageService from '../services/messageService.js'

// Получить все сообщения из комнаты
export async function getMessages(req, res, next) {
    try {
        const messages = await messageService.getMessages(req.params.id) // req.params.id = roomId
        res.status(200).json({ messages }) // отправляем список сообщений
    } catch (error) {
        next(error) // передаём ошибку в errorHandler
    }
}

// Отправить новое сообщение в комнату
export async function createMessage(req, res, next) {
    try {
        const message = await messageService.createMessage(
            req.params.id,        // roomId
            req.user.sub,         // supabaseId (из JWT токена)
            req.body.content      // текст сообщения
        )
        res.status(201).json({ message }) // 201 = Created
    } catch (error) {
        next(error)
    }
}