import { Router } from 'express'
import * as messageController from '../controllers/messageController.js'
import authenticate from '../middleware/authenticate.js'

const router = Router()

// GET /rooms/:id/messages - получить сообщения комнаты (требуется авторизация)
router.get('/:id/messages', authenticate, messageController.getMessages)

export default router