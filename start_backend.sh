#!/bin/bash
set -e
cd /Users/zousirui/Desktop/评课社区/backend/jcourse_api-master
source .venv/bin/activate
python manage.py migrate --noinput
python manage.py runserver 0.0.0.0:8000
