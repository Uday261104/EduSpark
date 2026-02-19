from rest_framework import serializers
from .models import Course,Section,Chapter,Enrollment
from django.db.models import Sum

class ChapterSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        fields = ["id", "title", "video_url", "video_duration", "order"]

    def get_video_url(self, obj):   # ✅ MUST BE INSIDE CLASS
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return None

        user = request.user
        course = obj.section.course

        # If you have related_name="enrollments"
        is_enrolled = course.enrollments.filter(user=user).exists()

        # If you DO NOT have related_name use this instead:
        # is_enrolled = course.enrollment_set.filter(user=user).exists()

        is_creator = course.creator_id == user.id

        if is_enrolled or is_creator:
            return obj.video_url

        return None

class SectionSerializer(serializers.ModelSerializer):
    chapters=ChapterSerializer(many=True,read_only=True)

    class Meta:
        model = Section
        fields = ['id','title','order','chapters']

class CourseSerializer(serializers.ModelSerializer):
    total_hours =serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields=[
            "id",
            "title",
            "description",
            "thumbnail",
            "requirements",
            "total_hours"
        ]
        read_only_field=["total_hours"]

    def get_total_hours(self,obj):
        total_hours=Chapter.objects.filter(
            section__course=obj
        ).aggregate(
            total = Sum("video_duration")
        )["total"] or 0
        return total_hours
    
class CourseDetailSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    total_hours = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "thumbnail",
            "requirements",
            "total_hours",
            "sections",
            "is_published",
        ]

    def get_total_hours(self, obj):
        total_hours = Chapter.objects.filter(
            section__course=obj
        ).aggregate(
            total = Sum("video_duration")
        )["total"] or 0
        return total_hours
    
class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ["course"]

    def create(self, validated_data):
        user = self.context["request"].user
        return Enrollment.objects.create(
            user=user,
            **validated_data
        )


class CourseListSerializer(serializers.ModelSerializer):

    is_enrolled = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "thumbnail",
            "is_enrolled",
            "creator_id",
        ]

    def get_thumbnail(self, obj):
        request = self.context.get("request")
        if obj.thumbnail:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None

    

    def get_is_enrolled(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return Enrollment.objects.filter(user=user, course=obj).exists()
        return False