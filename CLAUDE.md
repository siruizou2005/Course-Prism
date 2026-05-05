# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

本文档为 Claude Code (claude.ai/code) 在本项目中工作时提供指导。

## Git 提交规范

所有提交的作者只能是 siruizou2005 <siruizou2005@gmail.com>，不得在提交信息中添加任何 `Co-Authored-By: Claude` 相关内容。

## 项目概述

凯学邦 (Course-Prism) 是西南财经大学 (SWUFE) 的课程评价社区平台。学生可以搜索课程、查看/撰写评价、关注课程、查看课程统计信息。

## 项目结构

```
Course-Prism/
├── CLAUDE.md              # Claude Code 指导文件
├── DEPLOYMENT.md         # 部署指南
├── EXTRACTION_SUMMARY.md # 数据提取总结
├── full_database_data.sql # 数据库数据备份
├── assets/               # 静态资源
├── pic/                  # 图片资源
├── configs/              # 配置文件模板 (Nginx, systemd, 环境变量)
├── data/                 # 学生评价数据 (CSV + 导入脚本)
├── original-data/        # 原始数据（课表、数据库备份）
├── frontend/             # 前端应用 (Next.js)
└── backend/              # 后端 API (Django)
```

## 常用命令

### 前端 (Next.js)

```bash
cd frontend/jcourse-master

# 安装依赖
yarn

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build

# 运行测试
yarn test

# 代码格式化
yarn format
```

### 后端 (Django)

```bash
cd backend/jcourse_api-master

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows 下使用 venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 运行数据库迁移
python manage.py migrate

# 启动开发服务器
python manage.py runserver

# 运行测试
python manage.py test

# 运行指定测试
python manage.py test jcourse_api.tests.test_course

# 收集静态文件
python manage.py collectstatic
```

### Django 管理命令

```bash
# 检查重复评价
python manage.py check_duplicate

# 清理重复评价
python manage.py remove_duplicate_reviews

# 导入课程数据
python manage.py import

# 更新学期数据
python manage.py update_semester
```

## 架构

### 前端 (Next.js + Ant Design)

- **框架**: Next.js 13 (Pages Router)
- **UI 库**: Ant Design 5
- **状态管理**: SWR (数据获取)、ahooks (React Hooks)
- **API 客户端**: Axios，封装在 `src/services/request.ts`
- **类型定义**: `src/lib/models.ts`

**前端目录结构:**
- `pages/` - 页面 (25个页面：首页、课程列表/详情、评价、搜索、统计等)
- `components/` - 公共组件 (33个：课程卡片、评价列表、导航栏等)
- `services/` - API 接口封装 (course.ts, review.ts, user.ts, statistic.ts 等)
- `lib/` - 工具函数 (utils.ts, context.ts, models.ts)
- `config/` - 应用配置

### 后端 (Django + DRF)

- **框架**: Django 4.2 + Django REST Framework
- **数据库**: PostgreSQL (需要 psycopg)
- **缓存**: Redis (可选，通过 REDIS_HOST 环境变量配置)
- **任务队列**: Huey (异步任务)
- **认证**: OAuth 认证 (oauth 应用)

**Django 应用:**
- `jcourse_api` - 主 API 应用，包含 models、views、serializers
- `oauth` - OAuth 认证，包含用户最后访问时间中间件
- `ad` - 广告管理

**核心数据模型 (`jcourse_api/models/`):**
- `base.py`: Department, Semester
- `course.py`: Course, Teacher, Category, FormerCode
- `review.py`: Review, ReviewReaction, ReviewRevision
- `user.py`: UserProfile, UserPoint, UserPointRecord
- `site.py`: Announcement, Promotion, TouchPoint
- `notification.py`: Notification
- `course_notification_level.py`: CourseNotificationLevel

**API 端点 (`jcourse_api/views/`):**
- course.py - 课程 CRUD
- review.py - 评价 CRUD
- user.py - 用户信息
- common.py - 通用信息
- enroll.py - 选课/关注课程
- notification.py - 通知
- site.py - 站点设置
- teacher_evaluation.py - 教师评价
- upload.py - 文件上传

**数据仓库层:** `jcourse_api/repository/`

## 数据库

- 需要 PostgreSQL 数据库
- 数据库备份文件:
  - `full_database_backup.sql` - 完整结构 + 数据
  - `full_database_data.sql` - 仅数据
  - `original-data/backups/jcourse_backup_*.sql` - 定时备份

## 数据文件

### data/ - 学生评价数据
- `data-1.csv`, `data-2.csv`, `data-3.csv` - 评价数据
- `merged_teacher_evaluations.csv` - 合并的教师评价
- `individual_teacher_evaluations.csv` - 个人教师评价
- `import_to_database.py` - 导入脚本

### original-data/ - 原始数据
- `课表数据/` - 课程表 CSV 文件
- `merged_course_reviews.csv` - 合并的课程评价
- `backups/` - 数据库备份

## 环境变量

### 后端 (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgres://user:pass@localhost:5432/jcourse
REDIS_HOST=localhost
ALLOWED_HOSTS=localhost,127.0.0.1
POSTGRES_PASSWORD=your-password
```

### 前端 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 配置文件 (configs/)

- `backend.env.template` - 后端环境变量模板
- `frontend.env.template` - 前端环境变量模板
- `nginx.conf` / `nginx-ssl.conf` - Nginx 配置
- `jcourse-backend.service` / `jcourse-frontend.service` - systemd 服务配置
