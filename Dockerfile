# 使用 Nginx 镜像
FROM nginx:alpine

# 复制打包后的 dist 文件夹中的静态文件到 Nginx 的默认静态文件目录
COPY dist/ /usr/share/nginx/html

# 如果有自定义的 Nginx 配置文件，复制到容器
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80 # TODO: 这个端口号要和nginx.conf中的端口号一致?

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
