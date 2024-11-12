# Confhub2-be

## Giới thiệu

Confhub2-be kế thừa confhub-be viết bằng framework nestjs

## Cài đặt

1. **Cài đặt các gói npm:**

Chạy lệnh sau để cài đặt tất cả các gói cần thiết:

```bash
npm install
```

2. **Cấu hình tệp môi trường:**

Sao chép tệp `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Mở tệp `.env` và điền các thông tin sau:

```
DB_NAME = confhub-development
MONGO_URI = "mongodb+srv://localhub:datn.com@conflist.dcqmi.mongodb.net/thang?retryWrites=true&w=majority&appName=conflist"
```

DB_NAME: Tên cơ sở dữ liệu là confhub-development.

MONGO_URI: Chuỗi kết nối tới MongoDB

Mở Query Tool trong database confhub-development và chạy câu lệnh sau:

`create extension if not exists "uuid-ossp";`

3. **Đẩy cấu trúc cơ sở dữ liệu với Prisma:**

Chạy lệnh sau để đẩy cấu trúc cơ sở dữ liệu theo các mô hình đã được định nghĩa trong Prisma:

```bash
npx prisma db push
```

4. **Chạy ứng dụng:**

Chạy ứng dụng trong môi trường phát triển

```bash
npm run dev
```

## License
