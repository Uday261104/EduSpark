from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import CustomUser,Profile,CustomPermission,GroupPermissionMapping

admin.site.register(CustomUser)
admin.site.register(Profile)
admin.site.register(CustomPermission)
admin.site.register(GroupPermissionMapping)
