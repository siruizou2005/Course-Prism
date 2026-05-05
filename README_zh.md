# Course-Prism

> **语言:** [English](README.md) | 中文

西南财经大学（SWUFE）课程评价社区平台，学生可以搜索课程、查看/撰写评价、关注课程、查看课程统计信息。

🌐 **访问地址：** [class.swufe.chat](https://class.swufe.chat)

> **项目基础：** 本项目基于 [jcourse](https://github.com/SJTU-jCourse/jcourse) 开发，jcourse 是最初为上海交通大学开发的开源课程评价平台。感谢 jcourse 团队的出色工作。

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [服务器部署](#服务器部署)
- [项目结构](#项目结构)
- [常用命令](#常用命令)
- [环境变量](#环境变量)
- [故障排除](#故障排除)

## 项目概述

凯学邦（Course-Prism）提供以下功能：

- 📚 课程搜索与浏览
- ✍️ 课程评价撰写与查看
- ⭐ 课程收藏与关注
- 📊 课程统计与数据分析
- 👨‍🏫 教师评价系统
- 🔔 通知提醒功能
- 📈 访客统计

## 技术栈

**前端：**
- Next.js 16.1.6 (Pages Router)
- React 19.2.4
- Ant Design 6.1.0
- TypeScript 5.7.0
- SWR 2.3.0（数据获取）
- Axios 1.7.0（HTTP 客户端）
- Recharts 2.15.0（图表）

**后端：**
- Django 6.0.2
- Django REST Framework 3.16.1
- MySQL 8.0+（数据库）
- Redis（可选，用于缓存）
- Huey 2.5.2（任务队列）
- Gunicorn 23.0.0 / Uvicorn 0.32.0

## 快速开始

### 前置要求

- Node.js 18+ 和 Yarn
- Python 3.12+
- MySQL 8.0+

### 1. 克隆仓库

```bash
git clone https://github.com/siruizou2005/Course-Prism.git
cd Course-Prism
```

### 2. 安装并配置 MySQL

```bash
# macOS
brew install mysql
brew services start mysql

# 创建数据库和用户
mysql -u root -p
```

```sql
CREATE DATABASE jcourse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jcourse'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON jcourse.* TO 'jcourse'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 配置后端

```bash
cd backend/jcourse_api-master
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

创建 `.env` 文件：

```bash
DEBUG=True
SECRET_KEY=your-secret-key
MYSQL_DB=jcourse
MYSQL_USER=jcourse
MYSQL_PASSWORD=your_password
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
ALLOWED_HOSTS=localhost,127.0.0.1
```

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 4. 配置前端

```bash
cd frontend
yarn install
```

创建 `frontend/.env.local`：

```bash
REMOTE_URL=http://localhost:8000
```

### 5. 启动

```bash
# 终端 1 — 后端
./start_backend.sh

# 终端 2 — 前端
./start_frontend.sh
```

访问 http://localhost:3000 查看应用。

---

## 服务器部署

### 1. 准备服务器环境

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget build-essential nginx

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g yarn

# Python
sudo apt install -y python3 python3-pip python3-venv

# MySQL
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### 2. 克隆项目

```bash
cd /var/www
sudo git clone https://github.com/siruizou2005/Course-Prism.git
sudo chown -R $USER:$USER Course-Prism
cd Course-Prism
```

### 3. MySQL 配置

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE jcourse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jcourse'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON jcourse.* TO 'jcourse'@'localhost';
FLUSH PRIVILEGES;
```

### 4. 后端部署

```bash
cd backend/jcourse_api-master
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

创建 `.env`：

```bash
DEBUG=False
SECRET_KEY=your-very-long-random-secret-key
MYSQL_DB=jcourse
MYSQL_USER=jcourse
MYSQL_PASSWORD=your_secure_password
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CSRF_TRUSTED_ORIGINS=https://your-domain.com
```

```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### 5. 前端部署

```bash
cd ../../frontend
yarn install
```

创建 `frontend/.env.local`：

```bash
REMOTE_URL=https://api.your-domain.com
NODE_ENV=production
```

```bash
yarn build
```

### 6. systemd 服务配置

**后端** — `/etc/systemd/system/jcourse-backend.service`：

```ini
[Unit]
Description=JCourse Backend (Django/Gunicorn)
After=network.target mysql.service

[Service]
Type=notify
User=your-user
Group=www-data
WorkingDirectory=/var/www/Course-Prism/backend/jcourse_api-master
Environment="PATH=/var/www/Course-Prism/backend/jcourse_api-master/.venv/bin"
ExecStart=/var/www/Course-Prism/backend/jcourse_api-master/.venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    jcourse.wsgi:application
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**前端** — `/etc/systemd/system/jcourse-frontend.service`：

```ini
[Unit]
Description=JCourse Frontend (Next.js)
After=network.target

[Service]
Type=simple
User=your-user
Group=www-data
WorkingDirectory=/var/www/Course-Prism/frontend
Environment="NODE_ENV=production"
ExecStart=/usr/bin/yarn start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now jcourse-backend
sudo systemctl enable --now jcourse-frontend
```

### 7. Nginx 配置

```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    client_max_body_size 20M;

    location /static/ {
        alias /var/www/Course-Prism/backend/jcourse_api-master/static/;
    }
    location /media/ {
        alias /var/www/Course-Prism/backend/jcourse_api-master/media/;
    }
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/jcourse /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

### 8. SSL 证书（Let's Encrypt）

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

---

## 项目结构

```
Course-Prism/
├── README.md
├── README_zh.md
├── CLAUDE.md
├── start_backend.sh
├── start_frontend.sh
├── configs/
│   ├── backend.env.template
│   ├── frontend.env.template
│   ├── nginx.conf
│   └── jcourse-backend.service
├── backend/
│   └── jcourse_api-master/
│       ├── jcourse/          # Django 配置
│       ├── jcourse_api/      # 主应用（models、views、serializers）
│       ├── oauth/            # 认证模块
│       ├── ad/               # 广告管理
│       ├── manage.py
│       └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── lib/
│   ├── public/
│   └── package.json
├── data/
│   ├── data-*.csv
│   └── import_to_database.py
└── original-data/
```

## 常用命令

### 后端（Django）

```bash
cd backend/jcourse_api-master
source .venv/bin/activate

python manage.py runserver
python manage.py makemigrations && python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic

# 自定义命令
python manage.py check_duplicate
python manage.py remove_duplicate_reviews
python manage.py import
python manage.py update_semester
```

### 前端（Next.js）

```bash
cd frontend

yarn install
yarn dev      # 开发模式
yarn build    # 生产构建
yarn start    # 生产服务器
yarn test
yarn format
```

### 服务管理

```bash
sudo systemctl restart jcourse-backend
sudo systemctl restart jcourse-frontend
sudo journalctl -u jcourse-backend -f
sudo journalctl -u jcourse-frontend -f
```

## 环境变量

### 后端

| 变量 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `SECRET_KEY` | 是 | — | Django 密钥 |
| `DEBUG` | 否 | `False` | 开发时设为 `True` |
| `MYSQL_DB` | 否 | `jcourse` | 数据库名 |
| `MYSQL_USER` | 否 | `jcourse` | 数据库用户 |
| `MYSQL_PASSWORD` | 否 | `jcourse` | 数据库密码 |
| `MYSQL_HOST` | 否 | `127.0.0.1` | 数据库主机 |
| `MYSQL_PORT` | 否 | `3306` | 数据库端口 |
| `ALLOWED_HOSTS` | 是 | — | 允许的主机（逗号分隔） |
| `CSRF_TRUSTED_ORIGINS` | 生产必填 | — | CSRF 信任来源 |
| `REDIS_HOST` | 否 | — | Redis 主机（启用缓存） |

### 前端

| 变量 | 必填 | 说明 |
|---|---|---|
| `REMOTE_URL` | 是 | 后端 API 地址（Next.js 反向代理用） |

## 故障排除

| 问题 | 解决方案 |
|---|---|
| 前端无法获取数据 | 检查 `frontend/.env.local` 中的 `REMOTE_URL`；确认后端正在运行 |
| 数据库连接失败 | 检查 MySQL 状态（`brew services list` 或 `systemctl status mysql`）；核对 `.env` 配置 |
| 静态文件无法访问 | 运行 `collectstatic`；检查 Nginx alias 路径 |
| 服务启动失败 | 查看日志：`journalctl -u jcourse-backend -n 50` |
| `mysqlclient` 安装失败 | 设置 `MYSQLCLIENT_CFLAGS` 和 `MYSQLCLIENT_LDFLAGS`，参考 `mysql_config --cflags --libs` |

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
