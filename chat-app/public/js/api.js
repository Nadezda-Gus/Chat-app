// Базовый URL для API запросов
const API_URL = 'http://localhost:3000/api'

// Объект с методами для работы с API
const api = {
    // Получение токена из localStorage
    getToken() {
        return localStorage.getItem('token')
    },

    // Формирование заголовков для авторизованных запросов
    authHeaders() {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getToken()}`
        }
    },

    // Универсальный метод для выполнения запросов
    async request(path, options = {}) {
        const res = await fetch(`${API_URL}${path}`, options)
        const data = await res.json().catch(() => { })
        if (!res.ok) throw new Error(data.message || 'Ошибка запроса')
        return data
    },

    // Регистрация нового пользователя
    async register(email, password, name) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        })
        return data
    },

    // Вход пользователя
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        return data
    },

    // Выход из системы
    async logout() {
        await this.request('/auth/logout', {
            method: 'POST',
            headers: this.authHeaders(),
        })
    },

    // Получение данных текущего пользователя
    async getMe() {
        const data = await this.request('/auth/me', {
            headers: this.authHeaders(),
        })
        return data.user
    },

    // Получение ID комнат пользователя
    async getMyRooms() {
        const data = await this.request('/rooms/my', {
            headers: this.authHeaders(),
        })
        return data.roomIds
    },

    // Получение всех доступных комнат
    async getRooms() {
        const data = await this.request('/rooms', {
            headers: this.authHeaders(),
        })
        return data.rooms
    },

    // Создание новой комнаты
    async createRoom(name) {
        const data = await this.request('/rooms', {
            method: 'POST',
            headers: this.authHeaders(),
            body: JSON.stringify({ name })
        })
        return data.room
    },

    // Удаление комнаты по ID
    async deleteRoom(id) {
        await this.request(`/rooms/${id}`, {
            method: 'DELETE',
            headers: this.authHeaders(),
        })
    },

    // Получение сообщений из комнаты
    async getMessages(roomId) {
        const data = await this.request(`/rooms/${roomId}/messages`, {
            headers: this.authHeaders(),
        })
        return data.messages
    },
}