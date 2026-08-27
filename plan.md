# plan.md — ระบบ e-utilities-cost
## ระบบควบคุม-ติดตามค่าสาธารณูปโภค (Utility Expense Tracking & Control System)

### 1. ภาพรวมโครงการ (Overview)
ระบบเว็บแอปพลิเคชันสำหรับบันทึก ติดตาม และสรุปรายงานค่าสาธารณูปโภคของหน่วยงาน/สถานศึกษา รองรับการเบิกจ่ายจากหลายหมวดเงินงบประมาณ พร้อม dashboard สรุปยอดรายเดือนและดูข้อมูลย้อนหลัง ใช้งานได้ทั้งบนคอมพิวเตอร์ แท็บเล็ต และมือถือ

#### เป้าหมายหลัก
* บันทึกรายการค่าใช้จ่ายสาธารณูปโภคแยกตามประเภท
* ผูกรายการค่าใช้จ่ายกับหมวดเงินที่ใช้เบิกจ่าย
* แสดง dashboard สรุปยอดรายเดือน เปรียบเทียบย้อนหลัง
* จัดการ (CRUD) ข้อมูลรายการค่าใช้จ่ายและหมวดเงินได้
* ระบบสมาชิก login/logout ด้วย JWT
* Deploy ด้วย Docker และ build image ขึ้น Docker Hub

---

### 2. เทคโนโลยีที่ใช้ (Tech Stack)
* **Backend**: Node.js + Express.js
* **Frontend**: Vue 3 (Composition API) + Vite + Tailwind CSS
* **Database**: MariaDB
* **DB Admin**: phpMyAdmin
* **Authentication**: JWT (jsonwebtoken) + bcrypt (hash password)
* **ORM/Query**: Sequelize (แนะนำ Sequelize เพราะรองรับ MariaDB ดี)
* **Container**: Docker + Docker Compose (Docker Desktop)
* **Image Registry**: Docker Hub
* **Chart Library**: Chart.js หรือ ApexCharts (สำหรับ dashboard)
* **State Management**: Pinia
* **Routing**: Vue Router
* **HTTP Client**: Axios

---

### 3. โครงสร้างโปรเจกต์ (Project Structure)
```
e-utilities-cost/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── expenseCategory.model.js
│   │   │   ├── budgetCategory.model.js
│   │   │   └── expense.model.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── expense.controller.js
│   │   │   ├── expenseCategory.controller.js
│   │   │   ├── budgetCategory.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── expense.routes.js
│   │   │   ├── category.routes.js
│   │   │   └── dashboard.routes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/ (Sidebar, Navbar, MobileMenu)
│   │   │   ├── charts/
│   │   │   └── forms/
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── ExpenseListView.vue
│   │   │   ├── ExpenseFormView.vue
│   │   │   ├── CategoryManageView.vue
│   │   │   └── ReportHistoryView.vue
│   │   ├── stores/ (Pinia: auth, expense, category)
│   │   ├── router/
│   │   ├── services/ (api.js, auth.service.js)
│   │   ├── App.vue
│   │   └── main.js
│   ├── Dockerfile
│   ├── tailwind.config.js
│   └── package.json
├── docker-compose.yml
├── .env
└── plan.md
```

---

### 4. ออกแบบฐานข้อมูล (Database Design — MariaDB)

#### 4.1 ตาราง `users`
* `id` INT PK AUTO_INCREMENT
* `username` VARCHAR(50) UNIQUE
* `password` VARCHAR(255) (เก็บแบบ bcrypt hash)
* `full_name` VARCHAR(100)
* `role` ENUM('admin','staff') (สิทธิ์การใช้งาน)
* `created_at` DATETIME
* `updated_at` DATETIME

#### 4.2 ตาราง `expense_categories` (รายการประเภทค่าใช้จ่าย)
* `id` INT PK AUTO_INCREMENT
* `name` VARCHAR(100) (เช่น ค่าไฟฟ้า, ค่าน้ำประปา)
* `code` VARCHAR(20) (รหัสย่อ เช่น ELEC, WATER)
* `unit` VARCHAR(20) (หน่วย (บาท) — เผื่อขยาย)
* `is_active` BOOLEAN DEFAULT TRUE
* `created_at` DATETIME
* `updated_at` DATETIME

**ข้อมูลเริ่มต้น (seed):**
1. ค่าไฟฟ้า (ELEC)
2. ค่าพลังงาน (ENERGY)
3. ค่าน้ำประปา (WATER)
4. ค่าอินเตอร์เน็ต (INTERNET)
5. ค่าโทรศัพท์ (PHONE)
6. ค่าไปรษณีย์ (POST)
7. ค่าทิ้งขยะ (WASTE)

#### 4.3 ตาราง `budget_categories` (หมวดเงินที่ใช้เบิกจ่าย)
* `id` INT PK AUTO_INCREMENT
* `name` VARCHAR(150) (ชื่อหมวดเงิน)
* `code` VARCHAR(20) (รหัสย่อ)
* `is_active` BOOLEAN DEFAULT TRUE
* `created_at` DATETIME
* `updated_at` DATETIME

**ข้อมูลเริ่มต้น (seed):**
1. งบประมาณ (ปวช.)
2. งบประมาณ (ปวส.)
3. เงินรายได้สถานศึกษา

#### 4.4 ตาราง `expenses` (รายการค่าใช้จ่าย)
* `id` INT PK AUTO_INCREMENT
* `expense_category_id` INT FK -> expense_categories.id
* `budget_category_id` INT FK -> budget_categories.id
* `amount` DECIMAL(12,2) (จำนวนเงิน)
* `billing_month` DATE (เดือน/ปีของบิล เก็บเป็นวันที่ 1 ของเดือน)
* `paid_date` DATE (วันที่ชำระจริง)
* `invoice_no` VARCHAR(50) (เลขที่ใบแจ้งหนี้ - ถ้ามี)
* `note` TEXT (หมายเหตุ)
* `attachment_path` VARCHAR(255) (แนบไฟล์ใบเสร็จ - optional)
* `created_by` INT FK -> users.id
* `created_at` DATETIME
* `updated_at` DATETIME

#### 4.5 ความสัมพันธ์ (ERD สรุป)
* `users` (1) ───< (N) `expenses`
* `expense_categories` (1) ───< (N) `expenses`
* `budget_categories` (1) ───< (N) `expenses`

---

### 5. ระบบยืนยันตัวตน (Authentication — JWT)
* `POST /api/auth/login` → ตรวจสอบ username/password → คืน accessToken (JWT, อายุสั้น เช่น 1 ชม.) และ refreshToken (เก็บใน httpOnly cookie)
* `POST /api/auth/logout` → ล้าง refresh token
* `POST /api/auth/refresh` → ขอ accessToken ใหม่
* `GET /api/auth/me` → ดึงข้อมูล user ปัจจุบัน
* Middleware `auth.middleware.js` ตรวจสอบ `Authorization: Bearer <token>` ทุก endpoint ที่ต้อง login
* Frontend เก็บ accessToken ใน memory (Pinia store) ไม่เก็บใน localStorage เพื่อลดความเสี่ยง XSS
* Route guard ใน Vue Router redirect ไปหน้า login หาก token หมดอายุ/ไม่มี

---

### 6. ออกแบบ API (Backend Endpoints)
* **Auth**:
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/refresh`
  - `GET /api/auth/me`
* **Expense Categories**:
  - `GET /api/expense-categories`
  - `POST /api/expense-categories`
  - `PUT /api/expense-categories/:id`
  - `DELETE /api/expense-categories/:id`
* **Budget Categories**:
  - `GET /api/budget-categories`
  - `POST /api/budget-categories`
  - `PUT /api/budget-categories/:id`
  - `DELETE /api/budget-categories/:id`
* **Expenses**:
  - `GET /api/expenses?month=&year=&expense_category_id=&budget_category_id=`
  - `POST /api/expenses`
  - `GET /api/expenses/:id`
  - `PUT /api/expenses/:id`
  - `DELETE /api/expenses/:id`
* **Dashboard / Reports**:
  - `GET /api/dashboard/summary?year=` # สรุปยอดรวมรายเดือนทั้งปี
  - `GET /api/dashboard/by-category?year=` # สรุปแยกตามประเภทค่าใช้จ่าย
  - `GET /api/dashboard/by-budget?year=` # สรุปแยกตามหมวดเงิน
  - `GET /api/dashboard/compare?year1=&year2=` # เปรียบเทียบปีต่อปี

---

### 7. ออกแบบหน้าจอ (Frontend Pages)
* **Login** (`/login`): ฟอร์ม username/password
* **Dashboard** (`/`): การ์ดสรุปยอดเดือนปัจจุบัน, กราฟแท่ง/เส้นรายเดือน, กราฟวงกลมแยกตามประเภท, ตัวกรองปี/เดือน
* **รายการค่าใช้จ่าย** (`/expenses`): ตารางรายการ + ค้นหา/กรอง + pagination
* **เพิ่ม/แก้ไขค่าใช้จ่าย** (`/expenses/create`, `/expenses/:id/edit`): ฟอร์มบันทึกรายการ
* **จัดการประเภทค่าใช้จ่าย** (`/settings/expense-categories`): CRUD
* **จัดการหมวดเงิน** (`/settings/budget-categories`): CRUD
* **รายงานย้อนหลัง** (`/reports`): เลือกช่วงเวลา/ปี เปรียบเทียบ, export (PDF/Excel เป็น optional เพิ่มเติม)

#### Dashboard UI
* Summary cards: ยอดรวมเดือนนี้ / เดือนก่อน / เปลี่ยนแปลง % / ยอดรวมปีนี้
* กราฟแท่งเปรียบเทียบยอดรายเดือน 12 เดือน
* กราฟวงกลม สัดส่วนค่าใช้จ่ายแต่ละประเภท (ไฟฟ้า, น้ำ, เน็ต ฯลฯ)
* กราฟแท่งซ้อน แยกตามหมวดเงิน (ปวช./ปวส./เงินรายได้)
* ตารางสรุปย้อนหลังแบบเลือกปีเปรียบเทียบ

#### Responsive Design
* ใช้ Tailwind breakpoints: `sm` / `md` / `lg` / `xl`
* Desktop: Sidebar แบบ fixed ซ้ายมือ + เนื้อหาหลัก
* Tablet: Sidebar ยุบเป็นไอคอน (collapsible)
* Mobile: Sidebar เปลี่ยนเป็น bottom nav หรือ hamburger menu แบบ drawer
* ตารางข้อมูลบนมือถือ → ปรับเป็น card list แทน table (ใช้ `md:table hidden` + `block md:hidden` pattern)
* กราฟปรับขนาดอัตโนมัติด้วย responsive container ของ Chart.js

---

### 8. Docker Configuration
#### 8.1 docker-compose.yml
ตามโครงสร้างมาตรฐานที่ประกอบด้วยบริการ `mariadb`, `phpmyadmin`, `backend`, และ `frontend`

#### 8.2 Backend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

#### 8.3 Frontend Dockerfile
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

### 9. Security & Best Practices
* Hash password ด้วย bcrypt (salt rounds >= 10)
* JWT secret เก็บใน `.env` ห้าม commit ขึ้น git
* ใช้ `helmet`, `cors` (จำกัด origin เฉพาะ frontend), `express-rate-limit` ป้องกัน brute force login
* Validate input ทุก endpoint (เช่นใช้ `express-validator` หรือ `zod`)
* แยก `.env.example` ไว้เป็นตัวอย่าง ไม่ commit `.env` จริง
