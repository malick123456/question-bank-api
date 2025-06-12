const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Question = sequelize.define('Question', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  grade_id: DataTypes.INTEGER,
  subject_id: DataTypes.INTEGER,
  unit_id: DataTypes.INTEGER,
  type: DataTypes.TINYINT, // 1:选择 2:填空 3:应用
  content: DataTypes.TEXT,
  options: DataTypes.JSON,
  answer: DataTypes.TEXT,
  explanation: DataTypes.TEXT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'questions',
  timestamps: false
});


module.exports = Question;
