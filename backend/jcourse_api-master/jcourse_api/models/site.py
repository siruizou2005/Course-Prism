from django.db import models
from django.utils import timezone


class Announcement(models.Model):
    class Meta:
        verbose_name = '公告'
        ordering = ['-created_at']
        verbose_name_plural = verbose_name

    title = models.CharField(verbose_name='标题', max_length=256)
    message = models.TextField(verbose_name='正文', max_length=256)
    url = models.TextField(verbose_name='链接', max_length=256, null=True, blank=True)
    created_at = models.DateTimeField(verbose_name='发布时间', default=timezone.now)
    available = models.BooleanField(verbose_name='是否显示', default=True)

    def __str__(self):
        return self.title


class ApiKey(models.Model):
    class Meta:
        verbose_name = 'Api密钥'
        verbose_name_plural = verbose_name

    key = models.CharField(max_length=255, unique=True, db_index=True)
    description = models.CharField(verbose_name='描述', max_length=255)
    is_enabled = models.BooleanField(verbose_name='启用', default=True)
    modified_at = models.DateTimeField(verbose_name='修改时间', default=timezone.now)

    def __str__(self):
        return f"{self.description}：{self.key} - {self.modified_at}"


class TeamMember(models.Model):
    class Meta:
        verbose_name = '团队成员'
        verbose_name_plural = verbose_name
        ordering = ['order', 'name']

    name = models.CharField(verbose_name='姓名', max_length=100)
    role = models.CharField(verbose_name='职位', max_length=100)
    class_name = models.CharField(verbose_name='班级', max_length=100, blank=True, help_text='如：2021级金融学1班')
    description = models.TextField(verbose_name='简介', max_length=500, blank=True)
    avatar = models.ImageField(verbose_name='头像', upload_to='team_avatars/', blank=True, null=True)
    github = models.CharField(verbose_name='GitHub用户名', max_length=100, blank=True)
    qq = models.CharField(verbose_name='QQ号', max_length=20, blank=True)
    wechat = models.CharField(verbose_name='微信号', max_length=100, blank=True)
    email = models.EmailField(verbose_name='邮箱', blank=True)
    website = models.URLField(verbose_name='个人网站', blank=True)
    order = models.PositiveIntegerField(verbose_name='排序', default=0)
    is_active = models.BooleanField(verbose_name='是否显示', default=True)
    created_at = models.DateTimeField(verbose_name='添加时间', default=timezone.now)

    def save(self, *args, **kwargs):
        # 如果有新的头像上传，进行压缩
        if self.avatar and self.avatar.name:
            # 检查是否是新上传的文件（未压缩）
            if not self.avatar.name.endswith('_compressed.jpg'):
                try:
                    from utils.image_compress import compress_image
                    # 获取文件内容
                    self.avatar.file.seek(0)
                    compressed_image = compress_image(self.avatar.file)
                    # 保存压缩后的文件
                    self.avatar.save(
                        compressed_image.name,
                        compressed_image,
                        save=False
                    )
                except Exception as e:
                    print(f"头像压缩失败: {str(e)}")
                    # 压缩失败时继续保存原文件
                    pass
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.role}"


class Contributor(models.Model):
    class Meta:
        verbose_name = '贡献者'
        verbose_name_plural = verbose_name
        ordering = ['-contributions', 'name']

    name = models.CharField(verbose_name='姓名/昵称', max_length=100)
    class_name = models.CharField(verbose_name='班级', max_length=100, blank=True, help_text='如：2021级金融学1班')
    contribution_type = models.CharField(
        verbose_name='贡献类型', 
        max_length=50,
        choices=[
            ('code', '代码贡献'),
            ('design', '设计贡献'),
            ('translation', '翻译贡献'),
            ('documentation', '文档贡献'),
            ('testing', '测试贡献'),
            ('feedback', '反馈建议'),
            ('other', '其他贡献'),
        ],
        default='code'
    )
    description = models.TextField(verbose_name='贡献描述', max_length=300, blank=True)
    avatar = models.URLField(verbose_name='头像链接', blank=True)
    github = models.CharField(verbose_name='GitHub用户名', max_length=100, blank=True)
    contributions = models.PositiveIntegerField(verbose_name='贡献次数', default=1)
    is_active = models.BooleanField(verbose_name='是否显示', default=True)
    created_at = models.DateTimeField(verbose_name='添加时间', default=timezone.now)

    def __str__(self):
        return f"{self.name} ({self.get_contribution_type_display()})"


class VisitorStatistics(models.Model):
    class Meta:
        verbose_name = '访问统计'
        verbose_name_plural = verbose_name
        ordering = ['-visit_date']
        indexes = [
            models.Index(fields=['visit_date']),
            models.Index(fields=['ip_address']),
        ]

    visit_date = models.DateField(verbose_name='访问日期', default=timezone.now)
    ip_address = models.GenericIPAddressField(verbose_name='IP地址')
    country = models.CharField(verbose_name='国家', max_length=100, blank=True, null=True)
    region = models.CharField(verbose_name='地区/省份', max_length=100, blank=True, null=True)
    city = models.CharField(verbose_name='城市', max_length=100, blank=True, null=True)
    user_agent = models.TextField(verbose_name='用户代理', blank=True)
    created_at = models.DateTimeField(verbose_name='创建时间', default=timezone.now)

    class Meta:
        verbose_name = '访问统计'
        verbose_name_plural = verbose_name
        ordering = ['-created_at']
        unique_together = ('visit_date', 'ip_address')  # 每天每个IP只记录一次

    def __str__(self):
        location = f"{self.country or ''} {self.region or ''} {self.city or ''}".strip()
        return f"{self.ip_address} - {location} ({self.visit_date})"
