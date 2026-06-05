import * as messageService from '../services/messageService.js'

// Получить все сообщения из комнаты
export async function getMessages(req, res, next) {
    try {
        const messages = await messageService.getMessages(req.params.id)
        res.status(200).json({ messages }) // отправляем список сообщений
    } catch (error) {
        next(error) // передаём ошибку в errorHandler
    }
}