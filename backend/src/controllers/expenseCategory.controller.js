const ExpenseCategory = require('../models/expenseCategory.model');
const Expense = require('../models/expense.model');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await ExpenseCategory.findAll({
      order: [['id', 'ASC']]
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, code, unit, is_active } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required.' });
    }

    // Check if code already exists
    const existing = await ExpenseCategory.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({ message: `Expense category with code '${code}' already exists.` });
    }

    const category = await ExpenseCategory.create({
      name,
      code: code.toUpperCase(),
      unit: unit || 'บาท',
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({ success: true, message: 'Expense category created successfully.', data: category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, unit, is_active } = req.body;

    const category = await ExpenseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Expense category not found.' });
    }

    if (code && code.toUpperCase() !== category.code) {
      const existing = await ExpenseCategory.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({ message: `Expense category with code '${code}' already exists.` });
      }
      category.code = code.toUpperCase();
    }

    if (name) category.name = name;
    if (unit) category.unit = unit;
    if (is_active !== undefined) category.is_active = is_active;

    await category.save();
    res.json({ success: true, message: 'Expense category updated successfully.', data: category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await ExpenseCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Expense category not found.' });
    }

    // Check if there are associated expenses
    const associatedCount = await Expense.count({ where: { expense_category_id: id } });
    if (associatedCount > 0) {
      // Soft deactivate instead of hard delete to keep foreign keys valid
      category.is_active = false;
      await category.save();
      return res.json({
        success: true,
        message: 'Category has associated expenses. It has been deactivated instead of deleted.',
        data: category
      });
    }

    await category.destroy();
    res.json({ success: true, message: 'Expense category deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
