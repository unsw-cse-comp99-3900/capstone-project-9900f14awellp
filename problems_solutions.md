# 1. 在前后端分离项目中，前端如何打开后端服务器运行，从而调取api接口拿数据

后端封装 **docker-compose.yml** ,  **Dockerfile** 文件 和 **requirements.txt** ，前端不再需要自己配置虚拟环境，只需要运行

```shell
docker-compose up --build # 创建docker image
docker-compose up # 运行docker image
```

后端服务器就会开始运行。

【使用docker运行django前后端分离项目的后端服务器】 https://www.bilibili.com/video/BV1u83TedE44/?share_source=copy_web&vd_source=40534de17f3e1d5fe4a64c5ee3d07d6d

# 2. 前后端开发时，当前端从后端拿数据，会发送跨域预检请求  `OPTIONS` 请求到服务器，询问服务器是否允许实际请求。

在settings.py中设置 允许任何域名的请求，或者配置特定的

```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'corsheaders.middleware.CorsMiddleware',

]

CORS_ALLOW_ALL_ORIGINS = True  # 或者使用CORS_ALLOWED_ORIGINS配置特定的域名
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]
```

# 3. 实现login和register功能的时候，前端请求这两个端口会遇到 "detail: 身份验证信息未通过"的问题/

在settings.py中设置了

```python
    # 对用户登录的身份进行校验
    # 这一块发生在 "DEFAULT_PERMISSION_CLASSES" 之前的
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.BasicAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ]
```

这会对所有的views视图函数强制添加authentication验证

可以通过在特定的视图函数，例如Loginview中添加

```python
    authentication_classes = []  # 禁用认证
    permission_classes = []
```

这样前端访问这个api就不再需要在url中添加userid用来验证。

# 4. 数据库用户密码哈希问题，用户将个人信息存到数据库中，为了增强数据库安全性，需要将用户密码进行哈希

简单方法: 

```python
from django.contrib.auth.hashers import make_password, check_password
ser.validated_data['password'] = make_password(ser.validated_data['password']) # 将密码哈希
check_password(ser.validated_data['password'], instance.password) # 将用户输入的正常密码与哈希值进行比较
```



# 5. 用户忘记密码功能实现-Django

models.py: User表添加两行field

```python
reset_password_token = models.CharField(max_length=255, null=True, blank=True, verbose_name='Reset Password Token')
reset_password_sent_at = models.DateTimeField(null=True, blank=True, verbose_name='Reset Password Sent At')
```

views.py

```python
class PasswordResetRequestView(APIView):
    authentication_classes = []  # 禁用认证
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = request.build_absolute_uri(reverse('password_reset_confirm', args=[uid, token]))

        user.reset_password_token = token
        user.reset_password_sent_at = now()
        user.save()

        send_mail(
            'Password Reset',
            f'Use the link to reset your password: {reset_url}',
            'from@example.com',
            [email],
            fail_silently=False,
        )
        
        return Response({"message": "Password reset link sent"}, status=status.HTTP_200_OK)
    
class PasswordResetConfirmView(APIView):
    authentication_classes = []  # 禁用认证
    permission_classes = []

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            new_password = request.data.get('new_password')
            if not new_password:
                return Response({"error": "New password is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password) # set_password 方法会自动对提供的密码进行哈希处理并存储哈希值
            user.reset_password_token = None
            user.reset_password_sent_at = None
            user.save()
            return Response({"message": "Password has been reset"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid token or user ID"}, status=status.HTTP_400_BAD_REQUEST)
```

settings.py

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'ikezhao123@gmail.com' # google设置两步验证 后添加 应用专用密码
EMAIL_HOST_PASSWORD = 'kxirrbrpliuldrjz'  # 不包括空格
```

