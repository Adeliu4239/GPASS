# Frontend Dockerfile
FROM node:18.16.0-alpine

# 设置容器内的工作目录
WORKDIR /app/frontend

# 将依赖文件复制到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 将整个项目复制到工作目录
COPY . .

# 构建前端应用
RUN npm run build

# 暴露容器的端口
EXPOSE 3000

# 运行开发服务器
CMD ["npm", "run", "dev"]
