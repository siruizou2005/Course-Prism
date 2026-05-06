from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jcourse_api', '0048_visitorstatistics'),
    ]

    operations = [
        migrations.AddField(
            model_name='teammember',
            name='website',
            field=models.URLField(blank=True, verbose_name='个人网站'),
        ),
    ]
