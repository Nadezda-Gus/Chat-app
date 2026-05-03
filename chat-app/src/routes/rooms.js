import { Router } from 'express'
import * as roomController from '../controllers/roomController.js'
import authenticate from '../middleware/authenticate.js'
import { validate } from '../validators/auth.js'
import { createRoomSchema } from '../validators/room.js'

const router = Router()

// GET /rooms - получить список всех комнат (публичный)
router.get('/', roomController.getRooms)

// GET /rooms/:id - получить комнату по ID (публичный)
router.get('/:id', roomController.getRoomById)

// POST /rooms - создать новую комнату (требуется авторизация + валидация)
router.post('/', authenticate, validate(createRoomSchema), roomController.createRoom)

// DELETE /rooms/:id - удалить комнату (требуется авторизация)
router.delete('/:id', authenticate, roomController.deleteRoom)

// POST /rooms/:id/join - войти в комнату (требуется авторизация)
router.post('/:id/join', authenticate, roomController.joinRoom)

// DELETE /rooms/:id/leave - выйти из комнаты (требуется авторизация)
router.delete('/:id/leave', authenticate, roomController.leaveRoom)

export default router