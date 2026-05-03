import supabase from '../utils/supabase.js';
import prisma from '../prisma/prismaClient.js';
import AppError from '../utils/appError.js';

// Регистрация нового пользователя
export async function register(email, password, name) {
  // Создаём пользователя в Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new AppError(error.message, 400);

  // Создаём запись в своей БД (Prisma) с привязкой к Supabase ID
  const user = await prisma.user.create({
    data: {
      supabaseId: data.user.id,
      email,
      name,
    },
  });

  // Возвращаем пользователя и сессию
  return { user, session: data.session };
}

// Вход пользователя
export async function login(email, password) {
  // Проверяем email и пароль через Supabase
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new AppError('Неверный электронный адрес или пароль', 401);

  // Возвращаем сессию (токены)
  return { session: data.session };
}

// Выход пользователя (завершение сессии)
export async function logout(accessToken) {
  // Отзываем accessToken в Supabase
  const { error } = await supabase.auth.signOut(accessToken);
  if (error) throw new AppError(error.message, 400);
}