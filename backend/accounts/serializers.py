from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import CustomUser,Profile
from django.contrib.auth import authenticate

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES)

    class Meta:
        model = CustomUser
        fields =['email','password','role']

    def create(self,validated_data):
        role = validated_data.pop('role')
        user = CustomUser.objects.create_user(**validated_data,role=role)


        group_name=role.capitalize()
        group = Group.objects.get(name=group_name)
        user.groups.add(group)

        Profile.objects.create(user=user)

        return user
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["full_name"]


class UserPermissionSerializer(serializers.Serializer):
    permissions =serializers.ListField(child=serializers.CharField())

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .utils import get_user_permissions

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        data["user"] = {
            "id": user.id,
            "email": user.email,
            "username": getattr(user, "username", None),  # safe access
            "role": getattr(user, "role", None),
            "permissions": get_user_permissions(user),
        }

        return data
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password required")

        user = authenticate(
            request=self.context.get("request"),
            username=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "role": user.role,
            "permissions": get_user_permissions(user),
        }