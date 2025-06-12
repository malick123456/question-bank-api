// 用户路由

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const questionController = require('../controllers/questionController.js');
// 注册接口
router.post('/register', userController.register);
// 登录接口
router.post('/login', userController.login);
// 受保护接口，必须带 token
router.get('/me', userController.getProfile);
// 获取所有用户信息
router.post('/get_userinfo', userController.get_userinfo);
// 删除用户接口
router.delete('/deleteUser/:id', userController.deleteUser);
// 添加试题
router.post('/addQuestion', questionController.addQuestion);
// 获取试题详情
router.get('/getQuestionByIdDetails', questionController.getQuestionByIdDetails);
// 获取试题
router.post('/postQuestions', questionController.postQuestions);
// 编辑试题
router.post('/updateQuestion', questionController.updateQuestion);
// 删除试题
router.post('/deleteQuestion', questionController.deleteQuestion)

module.exports = router;
