const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next(); // hoặc return res.status(401).json({ message: "Chưa đăng nhập" });
  jwt.verify(token, 'YOUR_SECRET_KEY', (err, user) => {
    if (err) return next();
   req.user = decoded; 
    next();
  });
}

module.exports = authenticateToken;