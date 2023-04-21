# Sử dụng node.js version 14.x.x
FROM node:18

# Đặt thư mục làm thư mục làm việc
WORKDIR /nest-cloudinary

# Sao chép các tệp cần thiết vào bên trong container
COPY package*.json ./
COPY . .

#biến môi trường
ENV TIGRIS_URI=api.preview.tigrisdata.cloud
ENV TIGRIS_PROJECT=nest-tern
ENV TIGRIS_CLIENT_ID=tid_UUPzrUJLFBtMGtPXQldeBIlepQRTqy
ENV TIGRIS_CLIENT_SECRET=tsec_Fv3k9_16f7soSadZjogvh4HoZBHdkcheFDxH-CoM+SZQ5gHQFa
ENV TIGRIS_DB_BRANCH=main
ENV JWT_SECRET_AT=domi-app-at
ENV JWT_SECRET_RT=domi-app-rt
ENV PORT_SERVER=5050
# Cài đặt các gói phụ thuộc
RUN yarn

# Mở port 3000 cho ứng dụng
EXPOSE 3000

# Chạy lệnh start
CMD [ "yarn", "start" ]

#docker tag local-image:tagname new-repo:tagname
#docker push new-repo:tagname