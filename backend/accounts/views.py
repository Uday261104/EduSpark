from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignUpSerializer,ProfileSerializer
from .utils import get_user_permissions


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Signup successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        serializer=ProfileSerializer(request.user.profile)
        return Response(serializer.data)
    
    def put(self,request):
        print(request.user)
        serializer = ProfileSerializer(
            request.user.profile,data=request.data,partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class UserPermissionsView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        permissions = get_user_permissions(request.user)
        return Response({
            "role":request.user.role,
            "permissions":permissions
        })

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

