// 用户路由

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
// 受保护接口，必须带 token
router.get('/me', userController.getProfile);
module.exports = router;
