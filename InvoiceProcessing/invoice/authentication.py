from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User


class MyAhenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        username = request.parser_context['kwargs'].get('username')
        user = User.objects.filter(username=username).first()
        if  user != None:
            return user, None
        else:
            raise AuthenticationFailed('Invalid username.')
        