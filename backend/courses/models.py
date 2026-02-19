from django.db import models
from django.conf import settings
from django.db.models import F, Sum

User = settings.AUTH_USER_MODEL


# ===============================
# COURSE
# ===============================
class Course(models.Model):
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_courses"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to="thumbnails/", null=True, blank=True)
    requirements = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    total_hours = models.FloatField(default=0)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title


# ===============================
# SECTION
# ===============================
class Section(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="sections"
    )
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["order"]

    def save(self, *args, **kwargs):
        sections = Section.objects.filter(course=self.course)
        count = sections.count()

        if not self.order or self.order > count:
            self.order = count + 1
        else:
            sections.filter(order__gte=self.order).update(
                order=F("order") + 1
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.course.title} - {self.title}"


# ===============================
# CHAPTER
# ===============================
class Chapter(models.Model):
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="chapters"
    )
    title = models.CharField(max_length=255)
    video_url = models.URLField()
    video_duration = models.FloatField(null=True, blank=True)
    order = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["order"]

    def save(self, *args, **kwargs):
        chapters = Chapter.objects.filter(section=self.section)
        count = chapters.count()

        if not self.order or self.order > count:
            self.order = count + 1
        else:
            chapters.filter(order__gte=self.order).update(
                order=F("order") + 1
            )

        super().save(*args, **kwargs)

        # ✅ Update total course duration
        course = self.section.course
        total = Chapter.objects.filter(
            section__course=course
        ).aggregate(
            total=Sum("video_duration")
        )["total"] or 0

        course.total_hours = total
        course.save()

    def __str__(self):
        return self.title


# ===============================
# ENROLLMENT
# ===============================
class Enrollment(models.Model):
    STATUS_CHOICES = (
        ("active", "Active"),
        ("completed", "Completed")
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active"
    )
    enrolled_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "course")

    def __str__(self):
        return f"{self.user} -> {self.course}"