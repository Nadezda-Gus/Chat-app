import { createClient } from '@supabase/supabase-js'; // создание клиента Supabase
import config from '../config.js'; // импорт конфига

// Создаём клиент Supabase с URL и анонимным ключом из конфига
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export default supabase; // экспорт клиента для использования в других файлах