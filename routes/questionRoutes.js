const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// router.post('/', questionController.createQuestion);
// router.get('/', questionController.getAllQuestions);
// 添加试题
router.post('/addQuestion', questionController.addQuestion);
// 获取试题详情
router.get('/getQuestionByIdDetails', questionController.getQuestionByIdDetails);
// 获取所有试题
router.post('/getAllQuestions', questionController.getAllQuestions);
// 获取各年级试题
router.post('/postQuestions', questionController.postQuestions);
// 编辑试题
router.post('/updateQuestion', questionController.updateQuestion);
// 删除试题
router.post('/deleteQuestion', questionController.deleteQuestion)

module.exports = router;
