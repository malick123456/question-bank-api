const Question = require('../models/Question');

// 创建题目
exports.createQuestion = async (req, res) => {
  try {
    const { content, difficulty, subject_id, type_id } = req.body;

    if (!content || !subject_id || !type_id) {
      return res.status(400).json({ message: '缺少必要字段' });
    }

    const question = await Question.create({
      content,
      difficulty,
      subject_id,
      type_id
    });

    res.status(201).json({ message: '题目创建成功', question });
  } catch (error) {
    console.error('创建题目失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取所有题目
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({ total: questions.length, data: questions });
  } catch (error) {
    console.error('获取题目失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};
