const Question = require('../models/Question');

// 创建题目
exports.createQuestion = async (req, res) => {
  try {
    const { content, type_id, subject_id } = req.body;

    if (!content || !type_id || !subject_id) {
      return res.status(400).json({ message: '缺少必要字段' });
    }

    const question = await Question.create({
      content,
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
// 添加试题
exports.addQuestion = async (req, res) => {
  try {
    const {
      grade_id,
      type, 
      content, 
      options, 
      answer, 
      unit_id,
      subject_id,
      explanation
    } = req.body;

    if (!grade_id || !type || !content || !answer || !subject_id) {
      return res.status(400).json({ message: '必填字段缺失' });
    }

    const newQuestion = await Question.create({
      grade_id,
      subject_id,
      unit_id,
      type,
      content,
      options: type == 1 ? options : null,
      answer,
      explanation
    });

    res.status(200).json({
      msg: '试题添加成功',
      data: newQuestion
    });
  } catch (err) {
    console.error('添加题目失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取试题
exports.postQuestions = async (req, res) => {
  
  try {
    const { grade_id, subject_id, unit_id, type, page = 1, size = 10 } = req.body;

    const where = {};
    if (grade_id) where.grade_id = grade_id;
    if (subject_id) where.subject_id = subject_id;
    if (unit_id) where.unit_id = unit_id;
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

    res.json({
      msg: 'success',
      data,
      total: count,
      page: parseInt(page),
      size: limit,
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    console.error('查询题目失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};
 // 获取试题详情
 exports.getQuestionByIdDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ message: '题目不存在' });
    }

    res.json({
      msg: 'success',
      data: {
        ...question.toJSON(),
        created_at: new Date(question.created_at).getTime()
      }
    });
  } catch (err) {
    console.error('获取题目失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 编辑试题
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      grade_id,
      type, 
      content, 
      options, 
      answer, 
      subject_id,
      explanation
    } = req.body;

    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ message: '题目不存在' });

    await question.update({
      grade_id,
      type, 
      content,
      subject_id,
      options: type == 1 ? options : null,
      answer, explanation
    });

    res.json({ msg: '更新成功', data: question });
  } catch (err) {
    console.error('更新失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除试题
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ message: '题目不存在' });

    await question.destroy();
    res.json({ msg: '删除成功' });
  } catch (err) {
    console.error('删除失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};


