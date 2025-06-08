const mysql = require('mysql2/promise');
require('dotenv').config();

async function showDatabases() {
  // 连接数据库（不指定数据库名）
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
  });

  try {
    const [rows] = await connection.query('SHOW DATABASES');
    console.log('所有数据库列表:');
    rows.forEach(db => console.log('- ' + db.Database));
  } catch (err) {
    console.error('查询失败:', err);
  } finally {
    await connection.end();
  }
}

showDatabases();
