const app = require('./app');
const { sequelize, connectDB } = require('./config/db');
const User = require('./models/user.model');
const ExpenseCategory = require('./models/expenseCategory.model');
const BudgetCategory = require('./models/budgetCategory.model');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Seed function to initialize database content
const seedDatabase = async () => {
  try {
    // 1. Seed Users
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('Seeding default users...');
      const adminPassword = await bcrypt.hash('admin1234', 10);
      const staffPassword = await bcrypt.hash('staff1234', 10);

      await User.bulkCreate([
        {
          username: 'admin',
          password: adminPassword,
          full_name: 'System Administrator',
          role: 'admin'
        },
        {
          username: 'staff',
          password: staffPassword,
          full_name: 'Finance Staff',
          role: 'staff'
        }
      ]);
      console.log('Users seeded successfully.');
    }

    // 2. Seed Expense Categories
    const expCatCount = await ExpenseCategory.count();
    if (expCatCount === 0) {
      console.log('Seeding default expense categories...');
      await ExpenseCategory.bulkCreate([
        { name: 'ค่าไฟฟ้า', code: 'ELEC', unit: 'บาท' },
        { name: 'ค่าพลังงาน', code: 'ENERGY', unit: 'บาท' },
        { name: 'ค่าน้ำประปา', code: 'WATER', unit: 'บาท' },
        { name: 'ค่าอินเตอร์เน็ต', code: 'INTERNET', unit: 'บาท' },
        { name: 'ค่าโทรศัพท์', code: 'PHONE', unit: 'บาท' },
        { name: 'ค่าไปรษณีย์', code: 'POST', unit: 'บาท' },
        { name: 'ค่าทิ้งขยะ', code: 'WASTE', unit: 'บาท' }
      ]);
      console.log('Expense categories seeded.');
    }

    // 3. Seed Budget Categories
    const budCatCount = await BudgetCategory.count();
    if (budCatCount === 0) {
      console.log('Seeding default budget categories...');
      await BudgetCategory.bulkCreate([
        { name: 'งบประมาณ (ปวช.)', code: 'BG_VOC' },
        { name: 'งบประมาณ (ปวส.)', code: 'BG_DIP' },
        { name: 'เงินรายได้สถานศึกษา', code: 'BG_INC' }
      ]);
      console.log('Budget categories seeded.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const startServer = async () => {
  // Test connection
  await connectDB();

  // Sync DB and run seeders
  console.log('Synchronizing database models...');
  await sequelize.sync({ alter: true });
  console.log('Database synchronized.');

  await seedDatabase();

  // Start Express listener
  app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
