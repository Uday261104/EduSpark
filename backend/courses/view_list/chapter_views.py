from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

from courses.models import Chapter, Section
from courses.serializers import ChapterSerializer


# ===============================
# CREATE CHAPTER
# ===============================
class CreateChapterView(generics.CreateAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        section_id = self.request.data.get("section")

        if not section_id:
            raise PermissionDenied("Section ID is required")

        section = get_object_or_404(Section, id=section_id)

        # Only course creator can add chapters
        if section.course.creator != user:
            raise PermissionDenied("You can only modify your own course")

        serializer.save(section=section)


# ===============================
# UPDATE CHAPTER
# ===============================
class UpdateChapterView(generics.UpdateAPIView):
    queryset = Chapter.objects.select_related("section__course")
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        chapter = super().get_object()

        if chapter.section.course.creator != self.request.user:
            raise PermissionDenied("You can only modify your own course")

        return chapter


# ===============================
# DELETE CHAPTER
# ===============================
class DeleteChapterView(generics.DestroyAPIView):
    queryset = Chapter.objects.select_related("section__course")
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        chapter = super().get_object()

        if chapter.section.course.creator != self.request.user:
            raise PermissionDenied("You can only modify your own course")

        return chapter