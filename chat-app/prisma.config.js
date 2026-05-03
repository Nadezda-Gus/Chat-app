import { defineConfig } from 'prisma/config'
import 'dotenv/config'

// Конфигурация Prisma: путь к схеме и подключение к БД
export default defineConfig({
  schema: './src/prisma/schema/schema.prisma',
  generator: {
    output: './src/prisma/generated',
  },
  datasource: {
    url: process.env.DIRECT_URL,
    provider: 'postgresql',
  },
})