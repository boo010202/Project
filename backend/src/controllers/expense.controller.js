const Expense = require('../models/expense.model');
const ExpenseCategory = require('../models/expenseCategory.model');
const BudgetCategory = require('../models/budgetCategory.model');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

const getExpenses = async (req, res, next) => {
  try {
    const { month, year, expense_category_id, budget_category_id, page = 1, limit = 10 } = req.query;

    const where = {};

    // Apply filters
    if (expense_category_id) {
      where.expense_category_id = expense_category_id;
    }
    if (budget_category_id) {
      where.budget_category_id = budget_category_id;
    }

    if (year) {
      // If month is also provided
      if (month) {
        // month is 1-indexed, format it to two digits
        const formattedMonth = String(month).padStart(2, '0');
        where.billing_month = `${year}-${formattedMonth}-01`;
      } else {
        // Filter by entire year
        where.billing_month = {
          [Op.between]: [`${year}-01-01`, `${year}-12-01`]
        };
      }
    } else if (month) {
      // If only month is provided, filter by that month for any year (less common but possible)
      // Since billing_month is DATE, we use SQL function or Op.like
      where.billing_month = {
        [Op.like]: `%-${String(month).padStart(2, '0')}-01`
      };
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    const { count, rows } = await Expense.findAndCountAll({
      where,
      include: [
        { model: ExpenseCategory, as: 'category', attributes: ['id', 'name', 'code', 'unit', 'is_active'] },
        { model: BudgetCategory, as: 'budget', attributes: ['id', 'name', 'code', 'is_active'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'full_name'] }
      ],
      order: [
        ['paid_date', 'DESC'],
        ['id', 'DESC']
      ],
      limit: parsedLimit,
      offset
    });

    res.json({
      success: true,
      data: rows,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / parsedLimit),
        currentPage: parseInt(page),
        limit: parsedLimit
      }
    });
  } catch (error) {
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id, {
      include: [
        { model: ExpenseCategory, as: 'category' },
        { model: BudgetCategory, as: 'budget' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'full_name'] }
      ]
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense record not found.' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const {
      expense_category_id,
      budget_category_id,
      amount,
      billing_month,
      paid_date,
      invoice_no,
      note
    } = req.body;

    // Validation
    if (!expense_category_id || !budget_category_id || !amount || !billing_month || !paid_date) {
      // Remove uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Verify category exists and is active
    const category = await ExpenseCategory.findByPk(expense_category_id);
    if (!category || !category.is_active) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Invalid or inactive expense category.' });
    }

    // Verify budget exists and is active
    const budget = await BudgetCategory.findByPk(budget_category_id);
    if (!budget || !budget.is_active) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Invalid or inactive budget category.' });
    }

    if (parseFloat(amount) <= 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Amount must be greater than zero.' });
    }

    // Format billing month to YYYY-MM-01
    // e.g. input could be '2026-08-15' or '2026-08'
    let formattedBillingMonth = billing_month;
    if (billing_month.length === 7) {
      formattedBillingMonth = `${billing_month}-01`;
    } else if (billing_month.length >= 10) {
      formattedBillingMonth = `${billing_month.substring(0, 7)}-01`;
    }

    const attachment_path = req.file ? `/uploads/${req.file.filename}` : null;

    const expense = await Expense.create({
      expense_category_id,
      budget_category_id,
      amount: parseFloat(amount),
      billing_month: formattedBillingMonth,
      paid_date,
      invoice_no: invoice_no || null,
      note: note || null,
      attachment_path,
      created_by: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Expense record created successfully.',
      data: expense
    });
  } catch (error) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      expense_category_id,
      budget_category_id,
      amount,
      billing_month,
      paid_date,
      invoice_no,
      note
    } = req.body;

    const expense = await Expense.findByPk(id);
    if (!expense) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Expense record not found.' });
    }

    // Validate updates if provided
    if (expense_category_id) {
      const category = await ExpenseCategory.findByPk(expense_category_id);
      if (!category || !category.is_active) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Invalid or inactive expense category.' });
      }
      expense.expense_category_id = expense_category_id;
    }

    if (budget_category_id) {
      const budget = await BudgetCategory.findByPk(budget_category_id);
      if (!budget || !budget.is_active) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Invalid or inactive budget category.' });
      }
      expense.budget_category_id = budget_category_id;
    }

    if (amount !== undefined) {
      if (parseFloat(amount) <= 0) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Amount must be greater than zero.' });
      }
      expense.amount = parseFloat(amount);
    }

    if (billing_month) {
      let formattedBillingMonth = billing_month;
      if (billing_month.length === 7) {
        formattedBillingMonth = `${billing_month}-01`;
      } else if (billing_month.length >= 10) {
        formattedBillingMonth = `${billing_month.substring(0, 7)}-01`;
      }
      expense.billing_month = formattedBillingMonth;
    }

    if (paid_date) expense.paid_date = paid_date;
    if (invoice_no !== undefined) expense.invoice_no = invoice_no || null;
    if (note !== undefined) expense.note = note || null;

    if (req.file) {
      // Remove old file if it exists
      if (expense.attachment_path) {
        const oldFilePath = path.join(__dirname, '../..', expense.attachment_path);
        if (fs.existsSync(oldFilePath)) {
          try { fs.unlinkSync(oldFilePath); } catch (e) {}
        }
      }
      expense.attachment_path = `/uploads/${req.file.filename}`;
    }

    await expense.save();
    res.json({
      success: true,
      message: 'Expense record updated successfully.',
      data: expense
    });
  } catch (error) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense record not found.' });
    }

    // Delete attachment from disk if exists
    if (expense.attachment_path) {
      const filePath = path.join(__dirname, '../..', expense.attachment_path);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    }

    await expense.destroy();
    res.json({ success: true, message: 'Expense record deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
