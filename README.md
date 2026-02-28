# Course-Prism

> **Language:** English | [中文](README_zh.md)

A modern course review community platform for students at Southwestern University of Finance and Economics (SWUFE). Search courses, write reviews, rate instructors, and explore course statistics — all in one place.

🌐 **Live Site:** [class.swufe.chat](https://class.swufe.chat)

> **Based on:** This project is based on [jcourse](https://github.com/SJTU-jCourse/jcourse), the open-source course review platform originally developed for Shanghai Jiao Tong University. We sincerely thank the jcourse team for their excellent work.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Docker Deployment (Recommended)](#docker-deployment-recommended)
- [Local Development](#local-development)
- [Server Deployment](#server-deployment)
- [Data Migration](#data-migration)
- [Project Structure](#project-structure)
- [Common Commands](#common-commands)

## Overview

Course-Prism is a modern course review community that provides:

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
- PostgreSQL 16 (Docker)
- Redis 5.2.0 (cache)
- Huey 2.5.2 (task queue)
- Gunicorn 23.0.0 / Uvicorn 0.32.0

## Docker Deployment (Recommended)

Docker is the simplest and fastest deployment method, offering:
- ✅ Environment consistency — identical across dev, test, and production
- ✅ One-command deployment — up and running in under 5 minutes
- ✅ Easy migration — works on any cloud server
- ✅ Simplified ops — automated backup, restore, and updates

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+ or `docker compose` plugin
- At least 2 GB available memory
- At least 5 GB available disk space

### Quick Start

1. **Clone the project**
   ```bash
   git clone https://github.com/siruizou2005/Course-Prism.git
   cd Course-Prism
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   nano .env
   ```

   Required settings:
   ```bash
   SECRET_KEY=your-super-secret-key-here
   POSTGRES_PASSWORD=your-secure-password
   ALLOWED_HOSTS=your-domain.com,www.your-domain.com
   CSRF_TRUSTED_ORIGINS=https://your-domain.com
   ```

3. **Deploy**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Access the app**
   - Frontend: http://localhost
   - Backend API: http://localhost/api/
   - Django Admin: http://localhost/admin/

### Docker Compose Commands

```bash
docker-compose up -d                  # Start all services
docker-compose logs -f                # View logs
docker-compose logs -f backend        # View specific service logs
docker-compose down                   # Stop services
docker-compose restart                # Restart services
docker-compose up -d --build          # Rebuild and start
docker-compose exec backend bash      # Enter backend container
docker-compose exec frontend sh       # Enter frontend container
```

### Data Management

```bash
./backup.sh                                                           # Backup database
./restore.sh backups/db_backup_20260215_120000.sql                    # Restore database
docker-compose exec backend python manage.py migrate                  # Run migrations
docker-compose exec backend python manage.py createsuperuser          # Create superuser
docker-compose exec backend python manage.py collectstatic --noinput  # Collect static files
```

### Development Environment

```bash
docker-compose -f docker-compose.dev.yml up -d    # Start (with hot reload)
docker-compose -f docker-compose.dev.yml logs -f
docker-compose -f docker-compose.dev.yml down
```

Dev environment access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

> For full Docker documentation including architecture, SSL setup, and troubleshooting, see [DOCKER.md](DOCKER.md).

---

## Local Development

### Prerequisites

- Node.js 18+ and Yarn (Node.js 20+ recommended)
- Python 3.9+ (Python 3.11+ recommended)
- Docker and Docker Compose (for PostgreSQL)
- Redis (optional, for caching)

### Setup

#### 1. Clone the repository

```bash
git clone https://github.com/siruizou2005/Course-Prism.git
cd Course-Prism
```

#### 2. Start PostgreSQL and Redis

```bash
docker-compose up -d
```

#### 3. Backend setup

```bash
cd backend/jcourse_api-master
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../../configs/backend.env.template .env
# Edit .env with your settings
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

#### 4. Frontend setup

```bash
cd frontend/jcourse-master
yarn install
cp ../../configs/frontend.env.template .env.local
# Ensure .env.local contains:
# NEXT_PUBLIC_REMOTE_URL=http://localhost:8000
# REMOTE_URL=http://localhost:8000
yarn dev
```

Visit http://localhost:3000 to view the app.

---

## Server Deployment

### 1. Prepare server environment

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

### 2. Clone the project

```bash
cd /var/www
sudo git clone https://github.com/siruizou2005/Course-Prism.git
sudo chown -R $USER:$USER Course-Prism
cd Course-Prism
```

### 3. Database setup (Docker)

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

### 4. Backend deployment

```bash
cd backend/jcourse_api-master
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn
nano .env
```

**.env example:**
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

### 5. Frontend deployment

```bash
cd ../../frontend/jcourse-master
yarn install
nano .env.local
```

**.env.local example:**
```bash
NEXT_PUBLIC_REMOTE_URL=https://api.your-domain.com
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

**Frontend** — `/etc/systemd/system/jcourse-frontend.service`:
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

## Data Migration

### Export from old server

```bash
pg_dump -U jcourse -h localhost jcourse > full_database_backup.sql
```

### Transfer

```bash
scp full_database_backup.sql user@new-server:/var/www/Course-Prism/
```

### Import on new server

```bash
sudo -u postgres createdb jcourse
sudo -u postgres createuser jcourse
sudo -u postgres psql -c "ALTER USER jcourse WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE jcourse TO jcourse;"
psql -U jcourse -d jcourse -h localhost < full_database_backup.sql
```

### Migrate media files

```bash
# On old server
tar -czf media_files.tar.gz media/
scp media_files.tar.gz user@new-server:/var/www/Course-Prism/backend/jcourse_api-master/

# On new server
tar -xzf media_files.tar.gz
sudo chown -R your-user:www-data media/
```

---

## Project Structure

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

## Common Commands

### Backend (Django)

```bash
cd backend/jcourse_api-master
source venv/bin/activate

python manage.py runserver
python manage.py makemigrations && python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
python manage.py test

# Custom commands
python manage.py check_duplicate
python manage.py remove_duplicate_reviews
python manage.py import
python manage.py update_semester
```

### Frontend (Next.js)

```bash
cd frontend/jcourse-master

yarn install
yarn dev      # development
yarn build    # production build
yarn start    # production server
yarn format
yarn test
```

### Service management

```bash
sudo systemctl restart jcourse-backend
sudo systemctl restart jcourse-frontend
sudo journalctl -u jcourse-backend -f
sudo journalctl -u jcourse-frontend -f
```

## Troubleshooting

| Issue | Solution |
|---|---|
| Frontend can't fetch data | Check `REMOTE_URL` in `.env.local`; verify backend is running |
| Database connection failed | Check PostgreSQL status; verify `.env` credentials |
| Static files not accessible | Run `collectstatic`; check Nginx `alias` path and file permissions |
| Service won't start | Check logs: `journalctl -u jcourse-backend -n 50` |

## Environment Variables

### Backend

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | Yes | Django secret key |
| `DEBUG` | Yes | Set to `False` in production |
| `POSTGRES_PASSWORD` | Yes | Database password |
| `POSTGRES_HOST` | No | Database host (default: localhost) |
| `ALLOWED_HOSTS` | Yes | Comma-separated allowed hostnames |
| `CSRF_TRUSTED_ORIGINS` | Yes | Trusted origins for CSRF |
| `REDIS_HOST` | No | Redis host (optional) |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_REMOTE_URL` | Yes | API base URL (client-side) |
| `REMOTE_URL` | Yes | API base URL (server-side) |
| `NODE_ENV` | No | Runtime environment |

## Contributing

Issues and pull requests are welcome!

## License

MIT License
