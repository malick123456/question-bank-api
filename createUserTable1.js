const mysql = require('mysql2/promise');
require('dotenv').config();

async function createUserTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    multipleStatements: true   // ✅ 加上这一行！ 开启多条sql语句
  });

  const fs = require('fs');
  const path = require('path');
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');

  try {
    await connection.query(sql); // ✅ 用 query 而不是 execute
    console.log('✅ 数据库初始化成功');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
  } finally {
    await connection.end();
  }
}

createUserTable();
