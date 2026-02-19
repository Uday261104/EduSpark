from django.urls import path
from .views import LoginView
from .views import SignupView, ProfileView,UserPermissionsView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns=[
    path("signup/",SignupView.as_view()),
    path("login/",LoginView.as_view()),
    path("profile/",ProfileView.as_view()),
    path("permissions/",UserPermissionsView.as_view()),
    path("token/refresh/",TokenRefreshView.as_view()),
]