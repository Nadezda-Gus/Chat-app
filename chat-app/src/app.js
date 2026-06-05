import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import config from './config.js'
import errorHandler from './middleware/errorHandler.js'
import authRouter from './routes/auth.js'
import roomsRouter from './routes/rooms.js'
import messagesRouter from './routes/messages.js'
import { swaggerUi, spec } from '../docs/swagger.js'

const app = express()

// Ограничение количества запросов (rate limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP
})

// Middleware безопасности
app.use(helmet({
    countentSecurityPolicy:{
        directives:{
            scriptSrc:["'self'",'http://cnd.tailwindcss.com','http://localhost:3000'],
            imgScr:["'self'",'data'],
        },
    },
})) // Защита HTTP заголовков

// Настройка CORS
app.use(cors(config.cors))

// Парсинг JSON тела запроса
app.use(express.json())

app.use(express.static('public'))

// Маршруты
app.use('/api/auth', limiter, authRouter)        // Аутентификация (с ограничением запросов)
app.use('/api/rooms', roomsRouter)               // Комнаты
app.use('/api/rooms', messagesRouter)            // Сообщения (монтируем на тот же путь)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec)) // Swagger документация

// Глобальный обработчик ошибок (всегда в конце)
app.use(errorHandler)

export default app