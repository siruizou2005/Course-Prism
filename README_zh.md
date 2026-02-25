# Course-Prism

> **语言:** [English](README.md) | 中文

西南财经大学（SWUFE）课程评价社区平台，学生可以搜索课程、查看/撰写评价、关注课程、查看课程统计信息。

🌐 **访问地址：** [class.swufe.chat](https://class.swufe.chat)

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [Docker 容器化部署（推荐）](#docker-容器化部署推荐)
- [快速开始](#快速开始)
- [服务器部署指南](#服务器部署指南)
- [数据迁移指南](#数据迁移指南)
- [项目结构](#项目结构)
- [常用命令](#常用命令)

## 项目概述

凯学邦（Course-Prism）是一个现代化的课程评价社区平台，提供以下功能：

- 📚 课程搜索与浏览
- ✍️ 课程评价撰写与查看
- ⭐ 课程收藏与关注
- 📊 课程统计与数据分析
- 👨‍🏫 教师评价系统
- 🔔 通知提醒功能
- 📈 访客统计

## 技术栈

**前端:**
- Next.js 16.1.6 (Pages Router)
- React 19.2.4
- Ant Design 6.1.0
- TypeScript 5.7.0
- SWR 2.3.0 (数据获取)
- Axios 1.7.0 (HTTP 客户端)
- Recharts 2.15.0 (图表)

**后端:**
- Django 6.0.2
- Django REST Framework 3.16.1
- PostgreSQL 16 (Docker)
- Redis 5.2.0 (缓存)
- Huey 2.5.2 (任务队列)
- Gunicorn 23.0.0 / Uvicorn 0.32.0

## Docker 容器化部署（推荐）

使用 Docker 容器化部署是最简单快速的方式，提供：
- ✅ 环境一致性 — 开发、测试、生产环境完全相同
- ✅ 一键部署 — 5 分钟内完成部署
- ✅ 易于迁移 — 支持任何云服务器
- ✅ 简化运维 — 自动化备份、恢复、更新

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+ 或 `docker compose` 插件
- 至少 2GB 可用内存
- 至少 5GB 可用磁盘空间

### 一键部署

1. **克隆项目**
   ```bash
   git clone https://github.com/siruizou2005/Course-Prism.git
   cd Course-Prism
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   nano .env
   ```

   必须修改的配置项：
   ```bash
   SECRET_KEY=your-super-secret-key-here
   POSTGRES_PASSWORD=your-secure-password
   ALLOWED_HOSTS=your-domain.com,www.your-domain.com
   CSRF_TRUSTED_ORIGINS=https://your-domain.com
   ```

3. **一键部署**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **访问应用**
   - 前端: http://localhost
   - 后端 API: http://localhost/api/
   - Django Admin: http://localhost/admin/

### Docker Compose 命令

```bash
docker-compose up -d                  # 启动所有服务
docker-compose logs -f                # 查看日志
docker-compose logs -f backend        # 查看特定服务日志
docker-compose down                   # 停止服务
docker-compose restart                # 重启服务
docker-compose up -d --build          # 重新构建并启动
docker-compose exec backend bash      # 进入后端容器
docker-compose exec frontend sh       # 进入前端容器
```

### 数据管理

```bash
./backup.sh                                                           # 备份数据库
./restore.sh backups/db_backup_20260215_120000.sql                    # 恢复数据库
docker-compose exec backend python manage.py migrate                  # 运行迁移
docker-compose exec backend python manage.py createsuperuser          # 创建超级用户
docker-compose exec backend python manage.py collectstatic --noinput  # 收集静态文件
```

### 开发环境

```bash
docker-compose -f docker-compose.dev.yml up -d    # 启动（支持热重载）
docker-compose -f docker-compose.dev.yml logs -f
docker-compose -f docker-compose.dev.yml down
```

开发环境访问地址：
- 前端: http://localhost:3000
- 后端: http://localhost:8000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

> 完整 Docker 文档（架构说明、SSL 配置、故障排除等）请参考 [DOCKER.md](DOCKER.md)。

---

## 快速开始

### 前置要求

- Node.js 18+ 和 Yarn（推荐 Node.js 20+）
- Python 3.9+（推荐 Python 3.11+）
- Docker 和 Docker Compose

### 本地开发

#### 1. 克隆仓库

```bash
git clone https://github.com/siruizou2005/Course-Prism.git
cd Course-Prism
```

#### 2. 启动数据库

```bash
docker-compose up -d
```

#### 3. 后端设置

```bash
cd backend/jcourse_api-master
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../../configs/backend.env.template .env
# 编辑 .env 文件，设置数据库密码等
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

#### 4. 前端设置

```bash
cd frontend/jcourse-master
yarn install
cp ../../configs/frontend.env.template .env.local
# 确保 .env.local 包含：
# NEXT_PUBLIC_REMOTE_URL=http://localhost:8000
# REMOTE_URL=http://localhost:8000
yarn dev
```

访问 http://localhost:3000 查看应用。

---

## 服务器部署指南

### 1. 服务器环境准备

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget build-essential nginx

# Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g yarn

# Python
sudo apt install -y python3 python3-pip python3-venv

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. 克隆项目

```bash
cd /var/www
sudo git clone https://github.com/siruizou2005/Course-Prism.git
sudo chown -R $USER:$USER Course-Prism
cd Course-Prism
```

### 3. 数据库设置（Docker）

```bash
docker run -d \
  --name jcourse-postgres \
  --restart unless-stopped \
  -e POSTGRES_DB=jcourse \
  -e POSTGRES_USER=jcourse \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -v jcourse-db-data:/var/lib/postgresql/data \
  postgres:16
```

### 4. 后端部署

```bash
cd backend/jcourse_api-master
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn
nano .env
```

**.env 配置示例：**
```bash
DEBUG=False
SECRET_KEY=your-very-long-random-secret-key-here
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CSRF_TRUSTED_ORIGINS=https://your-domain.com
REDIS_HOST=localhost
```

```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### 5. 前端部署

```bash
cd ../../frontend/jcourse-master
yarn install
nano .env.local
```

**.env.local 配置示例：**
```bash
NEXT_PUBLIC_REMOTE_URL=https://api.your-domain.com
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
After=network.target postgresql.service

[Service]
Type=notify
User=your-user
Group=www-data
WorkingDirectory=/var/www/Course-Prism/backend/jcourse_api-master
Environment="PATH=/var/www/Course-Prism/backend/jcourse_api-master/venv/bin"
ExecStart=/var/www/Course-Prism/backend/jcourse_api-master/venv/bin/gunicorn \
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
WorkingDirectory=/var/www/Course-Prism/frontend/jcourse-master
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

## 数据迁移指南

### 导出数据（原服务器）

```bash
pg_dump -U jcourse -h localhost jcourse > full_database_backup.sql
```

### 传输文件

```bash
scp full_database_backup.sql user@new-server:/var/www/Course-Prism/
```

### 导入数据（新服务器）

```bash
sudo -u postgres createdb jcourse
sudo -u postgres createuser jcourse
sudo -u postgres psql -c "ALTER USER jcourse WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE jcourse TO jcourse;"
psql -U jcourse -d jcourse -h localhost < full_database_backup.sql
```

### 媒体文件迁移

```bash
# 原服务器打包
tar -czf media_files.tar.gz media/
scp media_files.tar.gz user@new-server:/var/www/Course-Prism/backend/jcourse_api-master/

# 新服务器解压
tar -xzf media_files.tar.gz
sudo chown -R your-user:www-data media/
```

---

## 项目结构

```
Course-Prism/
├── README.md
├── README_zh.md
├── DOCKER.md
├── configs/
│   ├── backend.env.template
│   ├── frontend.env.template
│   ├── nginx.conf
│   └── jcourse-backend.service
├── backend/
│   └── jcourse_api-master/
│       ├── jcourse_api/
│       ├── oauth/
│       ├── ad/
│       ├── manage.py
│       └── requirements.txt
├── frontend/
│   └── jcourse-master/
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── services/
│       │   └── lib/
│       ├── public/
│       └── package.json
├── data/
│   ├── data-*.csv
│   └── import_to_database.py
└── original-data/
```

## 常用命令

### 后端 (Django)

```bash
cd backend/jcourse_api-master
source venv/bin/activate

python manage.py runserver
python manage.py makemigrations && python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
python manage.py test

# 自定义命令
python manage.py check_duplicate
python manage.py remove_duplicate_reviews
python manage.py import
python manage.py update_semester
```

### 前端 (Next.js)

```bash
cd frontend/jcourse-master

yarn install
yarn dev      # 开发模式
yarn build    # 生产构建
yarn start    # 生产服务器
yarn format
yarn test
```

### 服务管理

```bash
sudo systemctl restart jcourse-backend
sudo systemctl restart jcourse-frontend
sudo journalctl -u jcourse-backend -f
sudo journalctl -u jcourse-frontend -f
```

## 故障排除

| 问题 | 解决方案 |
|---|---|
| 前端无法获取数据 | 检查 `.env.local` 中的 `REMOTE_URL`；确认后端正在运行 |
| 数据库连接失败 | 检查 PostgreSQL 状态；核对 `.env` 中的数据库配置 |
| 静态文件无法访问 | 运行 `collectstatic`；检查 Nginx alias 路径和文件权限 |
| 服务启动失败 | 查看日志：`journalctl -u jcourse-backend -n 50` |

## 环境变量说明

### 后端

| 变量 | 必填 | 说明 |
|---|---|---|
| `SECRET_KEY` | 是 | Django 密钥 |
| `DEBUG` | 是 | 生产环境设为 `False` |
| `POSTGRES_PASSWORD` | 是 | 数据库密码 |
| `POSTGRES_HOST` | 否 | 数据库主机（默认 localhost） |
| `ALLOWED_HOSTS` | 是 | 允许的主机列表（逗号分隔） |
| `CSRF_TRUSTED_ORIGINS` | 是 | CSRF 信任来源 |
| `REDIS_HOST` | 否 | Redis 主机（可选） |

### 前端

| 变量 | 必填 | 说明 |
|---|---|---|
| `NEXT_PUBLIC_REMOTE_URL` | 是 | API 地址（客户端） |
| `REMOTE_URL` | 是 | API 地址（服务端） |
| `NODE_ENV` | 否 | 运行环境 |

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
