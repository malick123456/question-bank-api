DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS grades;

-- 创建年级表
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

-- 创建科目表
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

-- 创建单元表
CREATE TABLE IF NOT EXISTS units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grade_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (grade_id) REFERENCES grades(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 创建题库表

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grade_id INT NOT NULL, -- 年级 1-6
  subject_id INT NOT NULL, -- 学科 Chinese语文  math 数学  en 英文
  unit_id INT DEFAULT NULL,
  semester TINYINT NOT NULL DEFAULT 1 COMMENT '1: 上学期, 2: 下学期',
  type TINYINT NOT NULL COMMENT '1:选择题, 2:填空题, 3:应用题',
  content TEXT NOT NULL, -- 题干
  options JSON DEFAULT NULL,     -- 仅选择题使用，存储 ABCD
  answer TEXT NOT NULL, -- 答案
  explanation TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 创建时间
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入年级数据
INSERT INTO grades (id, name) VALUES (1, '第1年级');
INSERT INTO grades (id, name) VALUES (2, '第2年级');
INSERT INTO grades (id, name) VALUES (3, '第3年级');
INSERT INTO grades (id, name) VALUES (4, '第4年级');
INSERT INTO grades (id, name) VALUES (5, '第5年级');
INSERT INTO grades (id, name) VALUES (6, '第6年级');

-- 插入科目数据
INSERT INTO subjects (id, name) VALUES (1, '语文');
INSERT INTO subjects (id, name) VALUES (2, '数学');
INSERT INTO subjects (id, name) VALUES (3, '英语');

-- 插入单元数据（每年级每科5单元，共90条）
-- 示例（完整脚本省略部分，以下是部分数据）
-- INSERT INTO units (id, grade_id, subject_id, name) VALUES (1, 1, 1, '第1单元');
-- INSERT INTO units (id, grade_id, subject_id, name) VALUES (2, 1, 1, '第2单元');
-- INSERT INTO units (id, grade_id, subject_id, name) VALUES (3, 1, 1, '第3单元');
-- ...
-- INSERT INTO units (id, grade_id, subject_id, name) VALUES (90, 6, 3, '第5单元');
