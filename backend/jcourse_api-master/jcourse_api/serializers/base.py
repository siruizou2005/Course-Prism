from django.contrib.auth.models import User
from rest_framework import serializers

from jcourse_api.models import Teacher, Semester, Announcement, Report, Notification, Category, Department, UserPoint, TeacherEvaluation, TeamMember, Contributor


class TeacherEvaluationSerializer(serializers.ModelSerializer):
    """教师评价序列化器"""
    teacher_name = serializers.CharField(source='teacher.name', read_only=True)
    evaluation_summary = serializers.SerializerMethodField()

    class Meta:
        model = TeacherEvaluation
        fields = ('id', 'teacher_name', 'evaluation_content', 'evaluation_summary',
                 'data_sources', 'evaluation_count', 'created_at')

    def get_evaluation_summary(self, obj):
        """获取评价摘要"""
        return obj.get_evaluation_summary()


class TeacherSerializer(serializers.ModelSerializer):
    evaluations = TeacherEvaluationSerializer(many=True, read_only=True)
    evaluation_count = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = ('id', 'tid', 'name', 'department', 'title', 'evaluations', 'evaluation_count')

    def get_evaluation_count(self, obj):
        """获取教师评价数量"""
        return obj.evaluations.count()


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ('id', 'name', 'available')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'is_staff')


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ('title', 'message', 'created_at', 'url')


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        exclude = ('solved',)
        read_only_fields = ('user', 'created_at', 'reply')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'recipient', 'type', 'description', 'created_at', 'read_at')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

    count = serializers.SerializerMethodField()

    @staticmethod
    def get_count(obj):
        return obj.count


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

    count = serializers.SerializerMethodField()

    @staticmethod
    def get_count(obj):
        return obj.count


class UserPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPoint
        exclude = ('user', 'id')


class TeamMemberSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TeamMember
        fields = ('id', 'name', 'role', 'class_name', 'description', 'avatar_url', 'github', 'qq', 'wechat', 'email', 'website', 'order')
        
    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class ContributorSerializer(serializers.ModelSerializer):
    contribution_type_display = serializers.CharField(source='get_contribution_type_display', read_only=True)
    
    class Meta:
        model = Contributor
        fields = ('id', 'name', 'class_name', 'contribution_type', 'contribution_type_display', 
                 'description', 'avatar', 'github', 'contributions')
