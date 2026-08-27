# e-utilities-cost — ระบบควบคุมและติดตามค่าสาธารณูปโภค

ระบบเว็บแอปพลิเคชันสำหรับบันทึก ติดตาม และสรุปรายงานค่าสาธารณูปโภคของหน่วยงาน/สถานศึกษา

## ภาพรวมระบบ

| Feature | รายละเอียด |
|---|---|
| 🔐 Authentication | JWT Access Token + Refresh Token (httpOnly Cookie) |
| 👥 Users | Admin / Staff roles |
| ⚡ Expense Categories | ประเภทค่าใช้จ่าย (ไฟฟ้า, น้ำ, อินเตอร์เน็ต ฯลฯ) |
| 💰 Budget Categories | หมวดเงินงบประมาณ (ปวช./ปวส./เงินรายได้) |
| 📋 Expenses | CRUD รายการค่าใช้จ่ายพร้อมแนบไฟล์ใบเสร็จ |
| 📊 Dashboard | กราฟสรุปยอดรายเดือน, แยกประเภท, แยกหมวดเงิน |
| 📈 Reports | เปรียบเทียบค่าใช้จ่ายระหว่างปี |
| 📱 Responsive | รองรับ Desktop, Tablet, Mobile |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js + Express.js |
| **Frontend** | Vue 3 (Composition API) + Vite + Tailwind CSS |
| **Database** | MariaDB 11 |
| **ORM** | Sequelize |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Charts** | Chart.js + vue-chartjs |
| **State** | Pinia |
| **Container** | Docker + Docker Compose |

---

## การรันด้วย Docker Compose (แนะนำ)

```bash
# 1. คัดลอกไฟล์ environment
cp .env.example .env

# 2. แก้ไขค่าใน .env ตามต้องการ
# (โดยเฉพาะ JWT_SECRET, DB_PASSWORD)

# 3. รัน services ทั้งหมด
docker compose up -d

# 4. เข้าใช้งาน
# Frontend:  http://localhost:8080
# Backend:   http://localhost:3000
# phpMyAdmin: http://localhost:8081
```

---

## การรันแบบ Development

### Prerequisites
- Node.js 20+
- MariaDB / MySQL (ท้องถิ่น หรือ Docker)

### Backend
```bash
cd backend
cp ../.env.example ../.env   # ปรับค่า DB_HOST=localhost
npm install
npm run dev
# Server: http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

---

## Docker Hub Images

| Image | Tag |
|---|---|
| `boodev/e-utilities-cost-backend` | `latest` |
| `boodev/e-utilities-cost-frontend` | `latest` |

### Build & Push
```bash
# Build images
docker build -t boodev/e-utilities-cost-backend:latest ./backend
docker build -t boodev/e-utilities-cost-frontend:latest ./frontend

# Push to Docker Hub
docker login
docker push boodev/e-utilities-cost-backend:latest
docker push boodev/e-utilities-cost-frontend:latest
```

---

## บัญชีผู้ใช้ Default (Seed Data)

| Username | Password | Role |
|---|---|---|
| `admin` | `admin1234` | Admin (CRUD ทุกอย่าง) |
| `staff` | `staff1234` | Staff (เพิ่ม/ดูรายการ) |

> ⚠️ กรุณาเปลี่ยนรหัสผ่านก่อนใช้งานจริง

---

## โครงสร้างโปรเจกต์

```
e-utilities-cost/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/  (auth, expense, category, dashboard)
│   │   ├── models/       (User, Expense, ExpenseCategory, BudgetCategory)
│   │   ├── routes/       (auth, expense, category, dashboard)
│   │   ├── middlewares/  (auth, error)
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── views/        (Login, Dashboard, ExpenseList, ExpenseForm, CategoryManage, Report)
│   │   ├── components/layout/ (Sidebar, Navbar, MobileMenu)
│   │   ├── stores/       (auth, expense, category)
│   │   ├── services/     (api.js, auth.service.js)
│   │   └── router/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── plan.md
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ | เข้าสู่ระบบ |
| POST | `/api/auth/logout` | ✅ | ออกจากระบบ |
| POST | `/api/auth/refresh` | Cookie | Refresh token |
| GET | `/api/auth/me` | ✅ | ข้อมูล user |
| GET | `/api/expense-categories` | ✅ | ดูประเภทค่าใช้จ่าย |
| POST | `/api/expense-categories` | Admin | เพิ่มประเภท |
| GET | `/api/budget-categories` | ✅ | ดูหมวดเงิน |
| GET | `/api/expenses` | ✅ | รายการค่าใช้จ่าย |
| POST | `/api/expenses` | ✅ | เพิ่มรายการ |
| GET | `/api/dashboard/summary` | ✅ | สรุปรายเดือน |
| GET | `/api/dashboard/by-category` | ✅ | แยกตามประเภท |
| GET | `/api/dashboard/compare` | ✅ | เปรียบเทียบปี |

---

## License
MIT License
