// 用户控制器
// 加密密码
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// 引入用户模型
const User = require('../models/User');

require('dotenv').config();
// 注册
exports.register = async (req, res) => {
  const { username, phone, password } = req.body

  // 1. 参数校验
  if (!username?.trim() || !phone?.trim() || !password?.trim()) {
    return res.status(400).json({ message: '所有字段均为必填项' })
  }

  // 2. 格式校验
  const phoneRegex = /^1[3-9]\d{9}$/
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: '手机号格式不正确' })
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: '密码需包含字母和数字，长度 6-20 位'
    })
  }

  try {
    // 3. 检查手机号是否存在
    const existingUser = await User.findOne({ where: { phone } })
    if (existingUser) {
      return res.status(409).json({ message: '该手机号已注册' })
    }

    // 4. 密码加密
    const hashedPassword = await bcrypt.hash(password, 10)

    // 5. 创建用户
    const user = await User.create({
      username: username.trim(),
      phone,
      password: hashedPassword
    })

    // 6. 成功响应（返回必要字段）
    return res.status(200).json({
      message: '用户注册成功',
      code: 200,
      data: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        created_at: user.created_at
      }
    })
  } catch (error) {
    console.error('注册失败:', error)

    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      return res.status(400).json({ message: error.errors?.[0]?.message || '注册失败' })
    }

    return res.status(500).json({ message: '服务器内部错误' })
  }
}
// 删除
// 删除用户
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  console.error('userId', req.params)

  if (!userId) {
    return res.status(400).json({ message: '缺少用户 ID' });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    await user.destroy(); // 删除用户

    res.status(200).json({ message: '用户删除成功' });
  } catch (err) {
    console.error('删除用户失败:', err);
    res.status(500).json({ message: '服务器错误，删除失败' });
  }
};

// 用户登陆
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: '邮箱和密码必填' });
  }

  try {
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: '密码错误' });
    }

    // ✅ 创建 JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        phone: user.phone
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    res.status(200).json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};
// 需要校验token和用户信息是否最新
exports.getProfile = async (req, res) => {
  try {
    // req.user 是JWT中解码后的用户数据
    // 也可以根据 id 查询数据库，确保信息最新
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'created_at']
    });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({ user });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};
// 获取用户所有信息

// exports.get_userinfo = async (req, res) => {
//   try {
//     // 获取分页参数，默认 page=1，limit=10
//     const { page, size } = req.body;
//     // 计算偏移量
//     const offset = (page - 1) * size;

//     // 获取数据 + 总数
//     const { count, rows } = await User.findAndCountAll({
//       attributes: ['id', 'username', 'phone', 'created_at'],
//       size,
//       offset,
//       order: [['created_at', 'DESC']] // 可选：按注册时间倒序
//     });
//     const users = await User.findAll({
//       attributes: ['id', 'username', 'phone', 'created_at']
//     });
//     // 转换 created_at 为时间戳（毫秒）
//     const data = users.map(user => ({
//       id: user.id,
//       username: user.username,
//       phone: user.phone,
//       created_at: `${new Date(user.created_at).getTime()}`
//     }));
//     res.status(200).json({
//       msg: 'success',
//       data: data,
//       total: count,        // 总条数
//       page,                // 当前页
//       size,               // 每页数量
//       totalPages: Math.ceil(count / size) // 总页数
//     });
//   } catch (err) {
//     console.error('查询用户失败:', err);
//     res.status(500).json({
//       status: 'error',
//       message: '查询用户失败'
//     });
//   }
// }
exports.get_userinfo = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.body;

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // 查询分页数据
    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'username', 'phone', 'created_at'],
      limit,
      offset,
      order: [['created_at', 'ASC']]
    });

    // 转换 created_at 为时间戳
    const data = rows.map(user => ({
      id: user.id,
      username: user.username,
      phone: user.phone,
      created_at: new Date(user.created_at).getTime()
    }));

    res.status(200).json({
      msg: 'success',
      data,
      total: count,
      page: parseInt(page),
      size: limit,
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    console.error('查询用户失败:', err);
    res.status(500).json({
      status: 'error',
      message: '查询用户失败'
    });
  }
};
