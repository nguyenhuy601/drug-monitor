const errorHandler = (err, req, res, next) => {
    try {
        // Log lỗi chi tiết
        console.error('Error Stack:', err.stack);

        try {
            // Nếu client request trang web (HTML)
            if (req.accepts('html')) {
                res.status(500).render('error', {
                    title: 'Internal Server Error',
                    message: err.message,
                    stack: process.env.NODE_ENV === 'development' ? err.stack : null
                });
            } 
            // Nếu client request API (JSON)
            else if (req.accepts('json')) {
                res.status(req.method === "GET" ? 500 : 400).json({
                    error: req.method === "GET" ? "Internal Server Error" : "Bad Request",
                    message: err.message
                });
            } 
            // Fallback plain text
            else {
                res.status(500).type('txt').send(err.message);
            }
        } catch (innerErr) {
            // Nếu có lỗi khi gửi response, log và fallback
            console.error('Error while sending response:', innerErr.stack);
            res.status(500).send('Something went wrong.');
        }
        
    } catch (outerErr) {
        // Nếu xảy ra lỗi bên ngoài, pass cho Express mặc định xử lý
        next(outerErr);
    }
};

module.exports = errorHandler;