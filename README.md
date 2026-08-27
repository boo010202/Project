# ระบบควบคุมและติดตามค่าสาธารณูปโภค (e-utilities-cost)
### Utility Expense Tracking & Control System

ระบบเว็บแอปพลิเคชันสำหรับบันทึก ติดตาม และสรุปรายงานค่าสาธารณูปโภคของหน่วยงานหรือสถานศึกษา ซึ่งพัฒนาขึ้นเพื่อรองรับการเบิกจ่ายงบประมาณจากหลายหมวดเงินงบประมาณ พร้อมทั้งนำเสนอข้อมูลสถิติในรูปแบบแดชบอร์ดกราฟที่เข้าใจง่าย และสามารถใช้งานได้แบบ Responsive บนอุปกรณ์คอมพิวเตอร์ แท็บเล็ต และมือถือ

---

## 🌟 ฟีเจอร์หลัก (Core Features)
1. **ระบบสมาชิกและสิทธิ์การใช้งาน (Authentication & Authorization)**
   - เข้าสู่ระบบและออกจากระบบผ่าน JWT (Access Token & HttpOnly Cookie Refresh Token)
   - ป้องกันสิทธิ์การเข้าถึง API และหน้าเพจผ่าน Middleware และ Navigation Guard
   - แบ่งบทบาทผู้ใช้งานเป็น `admin` และ `staff`
2. **ระบบจัดการประเภทค่าใช้จ่าย (Expense Categories CRUD)**
   - เพิ่ม ลบ แก้ไข และเปิด/ปิดใช้งานประเภทค่าใช้จ่าย (เช่น ค่าไฟฟ้า, ค่าน้ำประปา, ค่าอินเทอร์เน็ต)
3. **ระบบจัดการหมวดเงินงบประมาณ (Budget Categories CRUD)**
   - เพิ่ม ลบ แก้ไข และเปิด/ปิดใช้งานแหล่งเงินเบิกจ่าย (เช่น งบประมาณ ปวช., งบประมาณ ปวส., เงินรายได้สถานศึกษา)
4. **ระบบบันทึกรายการค่าใช้จ่ายจริง (Utility Expense Management CRUD)**
   - บันทึกยอดเงินค่าสาธารณูปโภค ผูกกับประเภทค่าใช้จ่ายและหมวดเงินเบิกจ่าย
   - สามารถระบุรอบบิล วันที่จ่ายเงิน เลขที่ใบแจ้งหนี้ หมายเหตุ และอัปโหลดไฟล์แนบหลักฐาน (ใบเสร็จ)
5. **แดชบอร์ดสรุปยอดและรายงาน (Dashboard & Report)**
   - การ์ดสรุปผลยอดรวมรายเดือน อัตราการเปลี่ยนแปลง เปรียบเทียบยอดรวมรายปี
   - กราฟแสดงสถิติต่างๆ: รายเดือนย้อนหลัง, สัดส่วนแยกตามประเภท (Pie Chart), ยอดเงินสะสมแยกตามหมวดงบประมาณ (Stacked Bar Chart)
   - หน้ารายงานย้อนหลังสำหรับการตรวจสอบข้อมูลและการเปรียบเทียบปีต่อปี พร้อมทั้งสั่งพิมพ์หรือบันทึกรายงาน
6. **การออกแบบ Responsive Design**
   - รองรับการแสดงผลทุกหน้าจอกระชับ ทันสมัย และสวยงาม (Desktop Sidebar, Tablet Collapsible, Mobile Drawer / Bottom Nav)
   - ปรับการแสดงผลตารางข้อมูลขนาดใหญ่ให้เป็นรูปแบบการ์ดอัตโนมัติบนมือถือ

---

## 🛠️ เทคโนโลยี (Tech Stack)
- **Backend**: Node.js + Express.js + Sequelize ORM + bcrypt + jsonwebtoken
- **Frontend**: Vue 3 (Composition API) + Vite + Tailwind CSS + Pinia + Vue Router + Chart.js + Axios
- **Database**: MariaDB + phpMyAdmin (สำหรับจัดการฐานข้อมูลในสภาพแวดล้อมพัฒนา)
- **Deployment**: Docker + Docker Compose + Docker Hub

---

## 🚀 วิธีการติดตั้งและรันระบบ (Setup & Running)

### 1. เตรียมความพร้อมของระบบ
ก่อนอื่น ให้แน่ใจว่าระบบของคุณมีการติดตั้ง:
- Node.js (แนะนำเวอร์ชัน 18 ขึ้นไป)
- Docker Desktop หรือ Docker Compose

### 2. ตั้งค่าไฟล์สภาพแวดล้อม (Environment Variables)
คัดลอกไฟล์ `.env.example` ไปเป็น `.env` ทั้งในส่วนของ root และปรับแต่งค่าตามความเหมาะสม:
```bash
cp .env.example .env
```
และระบุค่าสำหรับการเชื่อมต่อฐานข้อมูลและคีย์ลับของ JWT เช่น:
```env
# Database
DB_HOST=mariadb
DB_PORT=3306
DB_NAME=e_utilities_cost
DB_USER=app_user
DB_PASSWORD=changeme
DB_ROOT_PASSWORD=changeme_root

# Backend Configuration
PORT=3000
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. รันระบบผ่าน Docker Compose (สำหรับการใช้งานในพื้นที่พัฒนา)
สั่งทำงานผ่าน Docker Compose:
```bash
docker compose up -d
```
แอปพลิเคชันจะเปิดขึ้นและพร้อมใช้งานที่:
- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)
- **phpMyAdmin**: [http://localhost:8081](http://localhost:8081)

---

## 🛡️ ข้อมูลบัญชีผู้ใช้สำหรับการทดสอบเริ่มต้น (Test Accounts)
ระบบจะทำการ Seed บัญชีและข้อมูลประเภทค่าสาธารณูปโภค/หมวดเงินงบประมาณให้โดยอัตโนมัติในครั้งแรกที่รันระบบ:
- **สิทธิ์ Admin**:
  - Username: `admin`
  - Password: `admin1234`
- **สิทธิ์ Staff**:
  - Username: `staff`
  - Password: `staff1234`
