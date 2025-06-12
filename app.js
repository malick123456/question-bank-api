const express = require('express');
const fs = require('fs');
const sequelize = require('./config/db');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 这行必须加！启用 JSON body 解析
app.use(express.json());
app.use(cors());

// 测试数据库连接
sequelize.authenticate()
  .then(() => console.log('✅ MySQL连接成功'))
  .catch((err) => console.error('❌ 数据库连接失败:', err));

// 路由
const questionRoutes = require('./routes/questionRoutes');
app.use('/api/questions', questionRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


// 启动服务
app.listen(PORT, () => {
  console.log(`✅ API 运行中: http://localhost:${PORT}`);
});
