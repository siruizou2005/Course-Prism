from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('jcourse_api', '0021_semester_available'),
    ]

    operations = [
        migrations.RunPython(migrations.RunPython.noop, migrations.RunPython.noop),
    ]
