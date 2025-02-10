import jwt from 'jsonwebtoken';

let verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header
    if (!token) {
        return res.status(403).json({
            code: 9995,
            message: 'Lỗi phiên đăng nhập'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({
                code: 9994,
                message: 'Unauthorized!'
            });
        }

        req.user = decoded; // Gắn thông tin giải mã vào request
        next();
    });
};

module.exports = verifyToken;
