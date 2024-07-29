# 使用Node官方提供的镜像作为基础镜像
FROM node:latest
 
# 设置工作目录
WORKDIR /app
 
# 复制package.json文件和package-lock.json文件
COPY package*.json ./
 
# 安装项目依赖
RUN npm install
 
# 复制项目文件到工作目录
COPY . .

RUN npm run build
 
# 暴露容器的端口号
EXPOSE 3000
 
# 运行React项目的启动命令
CMD ["npm", "start"]