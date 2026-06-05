// Клиент для работы с WebSocket (Socket.IO)
const socketClient = {
    socket: null, // Экземпляр Socket.IO соединения

    // Установка соединения с сервером
    connect(token) {
        this.socket = io('http://localhost:3000/chat', {
            auth: { token }, // Передача токена для авторизации
        })

        // Обработка ошибки подключения
        this.socket.on('connect_error', (err) => {
            console.error('Socket ошибка подключения:', err.message)
        })
    },

    // Разрыв соединения
    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    },

    // Подключение к комнате чата
    joinRoom(roomId) {
        this.socket.emit('room:join', roomId)
    },

    // Выход из комнаты
    leaveRoom(roomId) {
        this.socket.emit('room:leave', roomId)
    },

    // Отправка сообщения в комнату
    sendMessage(roomId, content) {
        this.socket.emit('message:send', roomId, content)
    },

    // Слушатель: успешное подключение к комнате
    onRoomJoined(cb) {
        this.socket.on('room:joined', cb)
    },

    // Слушатель: выход из комнаты
    onRoomLeft(cb) {
        this.socket.on('room:left', cb)
    },

    // Слушатель: получение нового сообщения
    onMessage(cb) {
        this.socket.on('message:receive', cb)
    },

    // Слушатель: список пользователей в комнате
    onRoomUsers(cb) {
        this.socket.on('room:users', cb)
    },

    // Слушатель: пользователь стал онлайн
    onUserOnline(cb) {
        this.socket.on('user:online', cb)
    },

    // Слушатель: пользователь стал оффлайн
    onUserOffline(cb) {
        this.socket.on('user:offline', cb)
    },

    // Слушатель: ошибка от сервера
    onError(cb) {
        this.socket.on('error', cb)
    },
}