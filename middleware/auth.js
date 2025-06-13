// middlewares/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: '未提供 token，拒绝访问' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 把用户信息挂载在 req 上
    next();
  } catch (err) {
    return res.status(401).json({ message: '无效的 token' });
  }
};
