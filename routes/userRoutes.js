// 用户路由

const express = require('express');
const router = express.Router();
// 校验 token是否有效或者是否有token
const auth = require('../middleware/auth.js');
const userController = require('../controllers/userController.js');
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


module.exports = router;
