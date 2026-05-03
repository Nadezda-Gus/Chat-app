const errorHandler = (err, req, res, next) => {
    // Если ошибка известная (ожидаемая)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }

    // Логируем неизвестную ошибку в консоль
    console.error("Необработанная ошибка:", err);

    // Отдаём клиенту общий ответ без деталей
    res.status(500).json({
        status: "error",
        message: "Что-то пошло не так. Пожалуйста, попробуйте позже.",
    });
};

export default errorHandler; // Экспорт обработчика