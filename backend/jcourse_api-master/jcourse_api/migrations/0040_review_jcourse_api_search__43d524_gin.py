from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jcourse_api', '0039_review_search_vector'),
    ]

    operations = [
        # GinIndex 已移除：MySQL 不支持 PostgreSQL GIN 索引
    ]
