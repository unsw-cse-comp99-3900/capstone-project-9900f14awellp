# 使用官方的Python基础镜像
FROM python:3.9

# 设置工作目录
WORKDIR /INVOICE_PROCESSING

# 将当前目录的内容复制到工作目录
COPY . /INVOICE_PROCESSING/

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    build-essential \
    redis-tools \
    && apt-get clean
# 安装Python依赖
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 暴露端口
EXPOSE 8000

# 运行Django开发服务器
CMD ["python", "manage.py", "runserver_all", "0.0.0.0:8000"]
