const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error for debugging

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Hide stack in production
    });
};

module.exports = errorHandler;
