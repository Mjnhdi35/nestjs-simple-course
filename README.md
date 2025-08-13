# NestJS MySQL Connection Manager

## 📌 Giới thiệu

Dự án này sử dụng **NestJS + TypeORM + MySQL 8** với cơ chế:

- Kết nối cơ sở dữ liệu khi ứng dụng khởi chạy
- Health check định kỳ để phát hiện mất kết nối
- Tự động reconnect nếu DB restart hoặc mất kết nối giữa runtime

- **DatabaseModule**: Kết nối DB khi ứng dụng khởi chạy, health check định kỳ, auto reconnect.
- **UserModule**: CRUD user, hash password bằng bcrypt.
- **AuthModule**: JWT authentication (access + refresh token), login, register, refresh token.

---

## 🚀 Tính năng

- **Auto Reconnect**: Khi kết nối DB bị mất, hệ thống sẽ thử reconnect với thời gian chờ tăng dần (max 30s).
- **Health Check**: Mỗi 10s gửi query `SELECT 1` để kiểm tra kết nối.
- **Docker Support**: Chạy MySQL 8 qua `docker-compose`.
- **Auth & JWT**: Access token (ngắn hạn) + Refresh token (lưu cookie httpOnly, secure).
- **Bcrypt Service**: Hash password an toàn với salt rounds từ `.env`.
- **CRUD User**: Tạo, cập nhật, xoá, và xem thông tin user.
- **Refresh Token**: Lấy access token mới mà không cần login lại.

---

## 🐳 Cấu hình Docker

**docker-compose.yaml**

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8
    container_name: mysql8
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root1234
      MYSQL_DATABASE: mydb
      MYSQL_USER: devuser
      MYSQL_PASSWORD: devpass
    ports:
      - '3306:3306'
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## ⚙️ Cấu hình `.env`

```dotenv
PORT=8000

DB_HOST=localhost
DB_PORT=3306
DB_USER=devuser
DB_PASS=devpass
DB_NAME=mydb

BCRYPT_SALT_ROUNDS=12
JWT_SECRET=super_secret_access
JWT_REFRESH_SECRET=super_secret_refresh
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_COOKIE_NAME=refreshToken
JWT_REFRESH_COOKIE_DAYS=7

NODE_ENV=development
SERVER_DOMAIN=localhost
```

### 📝 Test API với curl

### 1️⃣ Register

```bash
curl -X POST http://localhost:8000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}'
```

### 2️⃣ Login

```bash

curl -X POST http://localhost:8000/auth/login \
-H "Content-Type: application/json" \
-d '{
"email": "john@example.com",
"password": "123456"
}'
```

### 3️⃣ Refresh Token

```bash
curl -X POST http://localhost:8000/auth/refresh \
-H "Content-Type: application/json" \
-H "Cookie: refreshToken=<your_refresh_token_here>"
```

### 4️⃣ Get Profile

```bash
curl -X GET http://localhost:8000/auth/profile \
-H "Authorization: Bearer <your_access_token_here>"
```

### 5️⃣ Update User

```bash
curl -X PATCH http://localhost:8000/user/<user_id> \
-H "Authorization: Bearer <your_access_token_here>" \
-H "Content-Type: application/json" \
-d '{
"name": "John Updated"
}'
```

### 6️⃣ Delete User

```bash
curl -X DELETE http://localhost:8000/user/<user_id> \
-H "Authorization: Bearer <your_access_token_here>"
```
