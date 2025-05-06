# 🚀 Team Matching

** Team Matching** là nền tảng giúp sinh viên FPTU dễ dàng tìm kiếm đội nhóm và cộng tác trong các dự án học thuật hoặc cá nhân.

[![Xem video demo](https://bsisystems.com/static/bioshare/img/demo_gray.jpg)](https://drive.google.com/file/d/1miVGYAuATpcYTTTzx8SlwD8nU4CvXayJ/view?usp=drive_link)

> 📽️ _Bấm vào ảnh để xem video demo_

## 🌟 Tính năng chính

### 🏆 **Quản lý Hồ sơ Cá nhân**

- Tạo hồ sơ với kỹ năng, sở thích và thành tựu.
- Giúp kết nối với dự án phù hợp.

### 👥 **Quản lý Đội Nhóm**

- Tạo & tham gia đội nhóm học thuật hoặc cá nhân.
- Phân vai trò, đánh giá thành viên, quản lý tiến độ.

### 📝 **Quản lý Blogs**

- Đăng & đọc blog về tìm đội nhóm hoặc dự án.
- Chia sẻ kinh nghiệm & mẹo làm việc nhóm.

### 💬 **Hệ thống Nhắn tin**

- Chat nhóm và nhắn tin riêng.
- Chia sẻ tệp, hình ảnh & tài liệu.

### 📅 **Thông báo & Sự kiện**

- Cập nhật các hội thảo, deadline & cột mốc quan trọng.
- Nhắc nhở sinh viên về hoạt động học thuật & ngoại khóa.

---

## 🔥 **Cách hoạt động**

1️⃣ **Tạo hồ sơ cá nhân** với kỹ năng & sở thích.  
2️⃣ **Tìm kiếm đội nhóm** phù hợp với nhu cầu.  
3️⃣ **Gửi yêu cầu tham gia hoặc tạo nhóm** mới.  
4️⃣ **Giao tiếp & cộng tác** qua hệ thống chat & blog.  
5️⃣ **Nhận thông báo sự kiện** & theo dõi tiến độ dự án.

---

## 🎯 **Yêu cầu hệ thống**

### ✅ **Yêu cầu chức năng**

#### 🔹 **Quản lý Đội Nhóm**

- Tạo & quản lý đội nhóm theo học kỳ hoặc dự án cá nhân.
- Tìm kiếm đội nhóm theo kỹ năng & mục tiêu.
- Nhóm có thể giao tiếp, phân vai trò & quản lý công việc.

#### 🔹 **Quản lý Mạng Xã Hội**

- Hồ sơ cá nhân cho sinh viên & giảng viên.
- Kết nối, tìm kiếm bạn bè & giảng viên theo kỹ năng.
- Đăng bài viết, tương tác & theo dõi thông tin dự án.

#### 🔹 **Hệ thống Nhắn tin**

- Nhắn tin riêng tư & nhóm.
- Chia sẻ tệp, hình ảnh, tài liệu.

---

## 🛠️ **Công nghệ sử dụng**

- **Backend:** Java Spring Boot ☕
- **Frontend:** React.js ⚛️ + Tailwind CSS 🎨
- **Database:** Docker-mysql 🐘

---

## 🛠️ **Cách chạy dự án đơn giản khi pull **

```bash
docker-compose up --build
```

- Lưu ý : Chưa có `.env` file. Bạn cần sao chép từ `.env.example` trước khi chạy Docker Compose.

```bash
touch .env  # Tạo file .env (nếu chưa có)
cp .env.example .env  # Sao chép cấu hình từ .env.example sang .env
docker-compose up --build  # Xây dựng và chạy dịch vụ
```
