import 'dotenv/config'; // Загрузка переменных из .env

const config = {
  port: process.env.PORT || 3000, // Порт сервера

  supabase: {
    url: process.env.SUPABASE_URL, // URL базы данных Supabase
    anonKey: process.env.SUPABASE_ANON_KEY, // Анонимный ключ Supabase
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Разрешённый фронтенд-домен
    credentials: true, // Разрешить куки / авторизацию
  },

  nodeEnv: process.env.NODE_ENV || 'development', // Окружение: development / production
};

export default config; // Экспорт конфига