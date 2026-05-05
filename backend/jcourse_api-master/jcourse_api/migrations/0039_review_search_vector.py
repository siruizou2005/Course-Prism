from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('jcourse_api', '0038_formercode_unique_record'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='search_vector',
            field=models.TextField(blank=True, editable=False, null=True),
        ),
    ]
