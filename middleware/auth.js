const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Bearer token格式
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: '未提供令牌' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: '令牌无效或已过期' });
    req.user = user; // 将解码后的用户信息挂载到请求对象
    next();
  });
}

module.exports = authenticateToken;
