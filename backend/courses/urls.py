from django.urls import path
from courses.view_list.course_views import (
    CreateCourseView,
    CourseListView,
    CourseUpdateView,
    EnrollCourseView,
    MyEnrollmentsView,
    LearnCourseView,
)

from courses.view_list.section_views import (
    CreateSectionView,
    UpdateSectionView,
    DeleteSectionView,
)

from courses.view_list.chapter_views import (
    CreateChapterView,
    UpdateChapterView,
    DeleteChapterView,
)

urlpatterns = [

    # ===============================
    # COURSE
    # ===============================
    path("courses/", CourseListView.as_view(), name="course-list"),
    path("courses/create/", CreateCourseView.as_view(), name="course-create"),
    path("courses/<int:pk>/update/", CourseUpdateView.as_view(), name="course-update"),

    # ===============================
    # ENROLLMENT
    # ===============================
    path("courses/<int:pk>/enroll/", EnrollCourseView.as_view(), name="course-enroll"),
    path("my-courses/", MyEnrollmentsView.as_view(), name="my-enrollments"),
    path("courses/<int:pk>/learn/", LearnCourseView.as_view(), name="course-learn"),

    # ===============================
    # SECTION
    # ===============================
    path("sections/<int:pk>/create/", CreateSectionView.as_view(), name="section-create"),
    path("sections/<int:pk>/update/", UpdateSectionView.as_view(), name="section-update"),
    path("sections/<int:pk>/delete/", DeleteSectionView.as_view(), name="section-delete"),

    # ===============================
    # CHAPTER
    # ===============================
    path("courses/<int:pk>/chapters/create/", CreateChapterView.as_view()),
    path("chapters/<int:pk>/update/", UpdateChapterView.as_view(), name="chapter-update"),
    path("chapters/<int:pk>/delete/", DeleteChapterView.as_view(), name="chapter-delete"),
]