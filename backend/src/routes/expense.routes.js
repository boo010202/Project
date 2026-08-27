const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (Optional, e.g. allow only images & PDF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpeg', '.jpg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and PDF are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// All routes here require authentication
router.use(isAuthenticated);

router.get('/', expenseController.getExpenses);
router.post('/', upload.single('attachment'), expenseController.createExpense);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', upload.single('attachment'), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
