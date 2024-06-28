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

