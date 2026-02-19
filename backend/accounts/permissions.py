from rest_framework.permissions import BasePermission
from .utils import get_user_permissions

class IsAuthorized(BasePermission):

    def has_permission(self,request,view):
        if not request.user or not request.user.is_authenticated:
            return False
    
        if request.user.role == "ADMIN":
            return True
        
        required_permission = getattr(view,"required_permission",None)

        if required_permission is None:
            return True

        user_permissions = get_user_permissions(request.user)
        return required_permission in user_permissions