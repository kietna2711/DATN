const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  jwt.verify(token, 'conguoiyeuchua', (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });
    req.user = decoded; // Đây là DÒNG QUAN TRỌNG NHẤT
    next();
  });
}

module.exports = authenticateToken;