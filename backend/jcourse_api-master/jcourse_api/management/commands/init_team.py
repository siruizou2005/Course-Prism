from django.core.management.base import BaseCommand
from jcourse_api.models import TeamMember, Contributor


class Command(BaseCommand):
    help = '初始化团队成员和贡献者数据'

    def handle(self, *args, **options):
        # 团队成员
        members = [
            {
                'name': '邹思瑞',
                'role': '项目负责人',
                'class_name': '',
                'description': 'SWUFE选课社区创始人与主要开发者',
                'github': 'siruizou2005',
                'email': 'siruizou2005@gmail.com',
                'website': 'https://siruizou.com/',
                'order': 1,
            },
        ]

        for m in members:
            obj, created = TeamMember.objects.update_or_create(
                name=m['name'],
                defaults=m,
            )
            self.stdout.write(f'{"创建" if created else "更新"}团队成员: {obj.name}')

        self.stdout.write(self.style.SUCCESS('团队数据初始化完成'))
