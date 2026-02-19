from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.contrib.auth.models import Group

class UserManager(BaseUserManager):
    def create_user(self,email,password=None,role="STUDENT",**extra_fields):
        if not email:
            raise ValueError("Email is Required")
        
        email = self.normalize_email(email)
        user = self.model(email=email,role=role,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,email,password=None,**extra_fields):
        user = self.create_user(
            email=email,
            password=password,
            role='ADMIN',
            **extra_fields
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    

class CustomUser(AbstractBaseUser,PermissionsMixin):
    ROLE_CHOICES=(
        ('STUDENT','Student'),
        ('CREATOR','Creator'),
        ('ADMIN','Admin'),
    )

    email = models.EmailField(unique = True)
    role = models.CharField(max_length=20,choices=ROLE_CHOICES)

    is_active=models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS=[]

    def __str__(self):
        return self.email

class Profile(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255,blank=True)

    def __str__(self):
        return self.user.email

class CustomPermission(models.Model):
    code_name=models.CharField(max_length=100,unique=True)
    description = models.TextField()

    def __str__(self):
        return self.code_name
    

class GroupPermissionMapping(models.Model):
    group = models.ForeignKey(Group,on_delete=models.CASCADE)
    permission = models.ForeignKey(CustomPermission,on_delete=models.CASCADE)

    class Meta:
        unique_together =("group","permission")

    def __str__(self):
        return f"{self.group.name}->{self.permission}"