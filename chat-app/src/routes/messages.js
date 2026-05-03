import { Router } from 'express'
import * as messageController from '.../controllers/messageController.js'
import authenticate from '../middleware/authenticate.js'
import { validate } from '../validators/auth.js'
import { createMessageSchema } from '../validators/message.js'

const router = Router()

// GET /rooms/:id/messages - получить сообщения комнаты (требуется авторизация)
router.get('/:id/messages', authenticate, messageController.getMessages)

// POST /rooms/:id/messages - отправить сообщение в комнату (требуется авторизация + валидация)
router.post('/:id/messages', authenticate, validate(createMessageSchema), messageController.createMessage)

export default router