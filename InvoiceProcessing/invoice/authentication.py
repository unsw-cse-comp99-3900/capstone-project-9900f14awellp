from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User


class MyAhenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        userid = request.parser_context['kwargs'].get('userid')
        user = User.objects.filter(id=userid).first()
        if  user != None:
            return user, None
        else:
            raise AuthenticationFailed('Invalid userid.')
        