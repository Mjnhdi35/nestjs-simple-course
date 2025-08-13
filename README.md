# NestJS MySQL Connection Manager

## 📌 Giới thiệu

Dự án này sử dụng **NestJS + TypeORM + MySQL 8** với cơ chế:

- Kết nối cơ sở dữ liệu khi ứng dụng khởi chạy
- Health check định kỳ để phát hiện mất kết nối
- Tự động reconnect nếu DB restart hoặc mất kết nối giữa runtime

---

## 🚀 Tính năng

- **Auto Reconnect**: Khi kết nối DB bị mất, hệ thống sẽ thử reconnect với thời gian chờ tăng dần (max 30s).
- **Health Check**: Mỗi 10s gửi query `SELECT 1` để kiểm tra kết nối.
- **Docker Support**: Chạy MySQL 8 qua `docker-compose`.

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
