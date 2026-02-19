from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAuthorized
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser 
from courses.models import Chapter, Course, Section, Enrollment
from courses.serializers import (
    EnrollmentSerializer,
    CourseSerializer,
    CourseDetailSerializer,
    CourseListSerializer,
)

class CreateCourseView(APIView):
    permission_classes = [IsAuthenticated, IsAuthorized]

    def post(self, request):
        serializer = CourseSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(creator=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CourseListView(APIView):

    def get(self, request):
        courses = Course.objects.filter(is_published=True)
        print("COURSES COUNT:", courses.count())
        serializer = CourseListSerializer(
            courses,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)


class CourseUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAuthorized]

    def put(self, request, pk):
        course = get_object_or_404(Course, pk=pk)

        if course.creator != request.user and request.user.role != "ADMIN":
            return Response({"detail": "Not allowed"}, status=403)

        serializer = CourseSerializer(course, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
    
class EnrollCourseView(APIView):
    permission_classes = [IsAuthenticated,IsAuthorized]

    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk)

        serializer = EnrollmentSerializer(
            data={"course": course.id},
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Enrolled successfully"},
            status=201
        )

class MyEnrollmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user)
        courses = [en.course for en in enrollments]

        serializer = CourseListSerializer(
            courses,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)
    
class LearnCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk)

        if course.creator == request.user:
            serializer = CourseDetailSerializer(course)
            return Response(serializer.data)

        is_enrolled = Enrollment.objects.filter(
            user=request.user,
            course=course
        ).exists()

        if not is_enrolled:
            return Response(
                {"detail": "You must enroll first"},
                status=403
            )

        serializer = CourseDetailSerializer(course)
        return Response(serializer.data)