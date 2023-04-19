# Sử dụng node.js version 14.x.x
FROM node:18

# Đặt thư mục làm thư mục làm việc
WORKDIR /nest-cloudinary

# Sao chép các tệp cần thiết vào bên trong container
COPY package*.json ./
COPY . .

# Cài đặt các gói phụ thuộc
RUN yarn

# Mở port 3000 cho ứng dụng
EXPOSE 3000

# Chạy lệnh start
CMD [ "yarn", "start" ]

#docker tag local-image:tagname new-repo:tagname
#docker push new-repo:tagname