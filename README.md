# Course-Prism

> **Language:** English | [中文](README_zh.md)

A course review community platform for students at Southwestern University of Finance and Economics (SWUFE). Search courses, write reviews, rate instructors, and explore course statistics — all in one place.

🌐 **Live Site:** [class.swufe.chat](https://class.swufe.chat)

> **Based on:** This project is based on [jcourse](https://github.com/SJTU-jCourse/jcourse), the open-source course review platform originally developed for Shanghai Jiao Tong University. We sincerely thank the jcourse team for their excellent work.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Server Deployment](#server-deployment)
- [Project Structure](#project-structure)
- [Common Commands](#common-commands)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Overview

Course-Prism provides:

- 📚 Course search and browsing
- ✍️ Write and read course reviews
- ⭐ Bookmark and follow courses
- 📊 Course statistics and data analysis
- 👨‍🏫 Instructor rating system
- 🔔 Notification system
- 📈 Visitor analytics

## Tech Stack

**Frontend:**
- Next.js 16.1.6 (Pages Router)
- React 19.2.4
- Ant Design 6.1.0
- TypeScript 5.7.0
- SWR 2.3.0 (data fetching)
- Axios 1.7.0 (HTTP client)
- Recharts 2.15.0 (charts)

**Backend:**
- Django 6.0.2
- Django REST Framework 3.16.1
- MySQL 8.0+ (database)
- Redis (optional, for caching)
- Huey 2.5.2 (task queue)
- Gunicorn 23.0.0 / Uvicorn 0.32.0

## Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Python 3.12+
- MySQL 8.0+

### 1. Clone the repository

```bash
git clone https://github.com/siruizou2005/Course-Prism.git
cd Course-Prism
```

### 2. Set up MySQL

```bash
# macOS
brew install mysql
brew services start mysql

# Create database and user
mysql -u root -p
```

```sql
CREATE DATABASE jcourse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jcourse'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON jcourse.* TO 'jcourse'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Set up the backend

```bash
cd backend/jcourse_api-master
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env`:

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

### 4. Set up the frontend

```bash
cd frontend
yarn install
```

Create `frontend/.env.local`:

```bash
REMOTE_URL=http://localhost:8000
```

### 5. Start

```bash
# Terminal 1 — backend
./start_backend.sh

# Terminal 2 — frontend
./start_frontend.sh
```

Visit http://localhost:3000.

---

## Server Deployment

### 1. Prepare the server

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

### 2. Clone the project

```bash
cd /var/www
sudo git clone https://github.com/siruizou2005/Course-Prism.git
sudo chown -R $USER:$USER Course-Prism
cd Course-Prism
```

### 3. MySQL setup

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE jcourse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jcourse'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON jcourse.* TO 'jcourse'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Backend deployment

```bash
cd backend/jcourse_api-master
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `.env`:

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

### 5. Frontend deployment

```bash
cd ../../frontend
yarn install
```

Create `frontend/.env.local`:

```bash
REMOTE_URL=https://api.your-domain.com
NODE_ENV=production
```

```bash
yarn build
```

### 6. systemd services

**Backend** — `/etc/systemd/system/jcourse-backend.service`:

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

**Frontend** — `/etc/systemd/system/jcourse-frontend.service`:

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

### 7. Nginx configuration

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

### 8. SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

---

## Project Structure

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
│       ├── jcourse/          # Django settings
│       ├── jcourse_api/      # Main app (models, views, serializers)
│       ├── oauth/            # Authentication
│       ├── ad/               # Ads management
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

## Common Commands

### Backend (Django)

```bash
cd backend/jcourse_api-master
source .venv/bin/activate

python manage.py runserver
python manage.py makemigrations && python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic

# Custom commands
python manage.py check_duplicate
python manage.py remove_duplicate_reviews
python manage.py import
python manage.py update_semester
```

### Frontend (Next.js)

```bash
cd frontend

yarn install
yarn dev      # development
yarn build    # production build
yarn start    # production server
yarn test
yarn format
```

### Service management

```bash
sudo systemctl restart jcourse-backend
sudo systemctl restart jcourse-frontend
sudo journalctl -u jcourse-backend -f
sudo journalctl -u jcourse-frontend -f
```

## Environment Variables

### Backend

| Variable | Required | Default | Description |
|---|---|---|---|
| `SECRET_KEY` | Yes | — | Django secret key |
| `DEBUG` | No | `False` | Set to `True` for development |
| `MYSQL_DB` | No | `jcourse` | Database name |
| `MYSQL_USER` | No | `jcourse` | Database user |
| `MYSQL_PASSWORD` | No | `jcourse` | Database password |
| `MYSQL_HOST` | No | `127.0.0.1` | Database host |
| `MYSQL_PORT` | No | `3306` | Database port |
| `ALLOWED_HOSTS` | Yes | — | Comma-separated hostnames |
| `CSRF_TRUSTED_ORIGINS` | Yes (prod) | — | Trusted origins for CSRF |
| `REDIS_HOST` | No | — | Redis host (enables caching) |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `REMOTE_URL` | Yes | Backend API URL for Next.js rewrites |

## Troubleshooting

| Issue | Solution |
|---|---|
| Frontend can't fetch data | Check `REMOTE_URL` in `frontend/.env.local`; verify backend is running |
| Database connection failed | Check MySQL status (`brew services list` or `systemctl status mysql`); verify `.env` credentials |
| Static files not accessible | Run `collectstatic`; check Nginx `alias` path |
| Service won't start | Check logs: `journalctl -u jcourse-backend -n 50` |
| `mysqlclient` install fails | Set `MYSQLCLIENT_CFLAGS` and `MYSQLCLIENT_LDFLAGS` — see `mysql_config --cflags --libs` |

## Contributing

Issues and pull requests are welcome!

## License

MIT License
