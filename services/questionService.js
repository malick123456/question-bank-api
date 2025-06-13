// services/questionService.js
const Question = require('../models/Question');

// 获取题目分类
exports.getQuestionsByType = async (req) => {
  const { grade_id, subject_id, unit_id, semester, type, page = 1, size = 10 } = req.body;

  const where = {};
  if (grade_id) where.grade_id = grade_id;
  if (subject_id) where.subject_id = subject_id;
  if (unit_id) where.unit_id = unit_id;
  if (semester) where.semester = semester;
  if (type) where.type = type;

  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;

  const { count, rows } = await Question.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });
  const data = rows.map(q => ({
    ...q.toJSON(),
    created_at: new Date(q.created_at).getTime()
  }));

  const result = {
    // 选择
    choice: [],
    // 填空
    fill: [],
    // 应用
    application: [],
    msg: 'success',
    total: count,
    page: parseInt(page),
    size: limit,
    totalPages: Math.ceil(count / limit)
  };

  data.forEach(q => {
    if (q.type === 1) result.choice.push(q);
    else if (q.type === 2) result.fill.push(q);
    else if (q.type === 3) result.application.push(q);
  });

  return result;
};
