# Backend Dockerfile
FROM node:18.16.1

# 设置容器内的工作目录
WORKDIR /app/backend

# 将依赖文件复制到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 将整个项目复制到工作目录
COPY . .

# 暴露容器的端口
EXPOSE 5000

# 运行应用
CMD node app.js
