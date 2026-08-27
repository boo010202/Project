const BudgetCategory = require('../models/budgetCategory.model');
const Expense = require('../models/expense.model');

const getAllBudgets = async (req, res, next) => {
  try {
    const budgets = await BudgetCategory.findAll({
      order: [['id', 'ASC']]
    });
    res.json({ success: true, data: budgets });
  } catch (error) {
    next(error);
  }
};

const createBudget = async (req, res, next) => {
  try {
    const { name, code, is_active } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required.' });
    }

    const existing = await BudgetCategory.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({ message: `Budget category with code '${code}' already exists.` });
    }

    const budget = await BudgetCategory.create({
      name,
      code: code.toUpperCase(),
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({ success: true, message: 'Budget category created successfully.', data: budget });
  } catch (error) {
    next(error);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, is_active } = req.body;

    const budget = await BudgetCategory.findByPk(id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget category not found.' });
    }

    if (code && code.toUpperCase() !== budget.code) {
      const existing = await BudgetCategory.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({ message: `Budget category with code '${code}' already exists.` });
      }
      budget.code = code.toUpperCase();
    }

    if (name) budget.name = name;
    if (is_active !== undefined) budget.is_active = is_active;

    await budget.save();
    res.json({ success: true, message: 'Budget category updated successfully.', data: budget });
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const budget = await BudgetCategory.findByPk(id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget category not found.' });
    }

    const associatedCount = await Expense.count({ where: { budget_category_id: id } });
    if (associatedCount > 0) {
      budget.is_active = false;
      await budget.save();
      return res.json({
        success: true,
        message: 'Budget category has associated expenses. It has been deactivated instead of deleted.',
        data: budget
      });
    }

    await budget.destroy();
    res.json({ success: true, message: 'Budget category deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};
