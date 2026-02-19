from .models import GroupPermissionMapping

def get_user_permissions(user):
    permissions = set()

    for group in user.groups.all():
        mappings = GroupPermissionMapping.objects.filter(group=group)
        for mapping in mappings:
            permissions.add(mapping.permission.code_name)

    return list(permissions)