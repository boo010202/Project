const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user.model');
const ExpenseCategory = require('./expenseCategory.model');
const BudgetCategory = require('./budgetCategory.model');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expense_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ExpenseCategory,
      key: 'id'
    }
  },
  budget_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BudgetCategory,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    }
  },
  billing_month: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Stored as YYYY-MM-01 (1st day of the billing month)'
  },
  paid_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  invoice_no: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attachment_path: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'expenses'
});

// Relationships
Expense.belongsTo(ExpenseCategory, { foreignKey: 'expense_category_id', as: 'category' });
ExpenseCategory.hasMany(Expense, { foreignKey: 'expense_category_id', as: 'expenses' });

Expense.belongsTo(BudgetCategory, { foreignKey: 'budget_category_id', as: 'budget' });
BudgetCategory.hasMany(Expense, { foreignKey: 'budget_category_id', as: 'expenses' });

Expense.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Expense, { foreignKey: 'created_by', as: 'expenses' });

module.exports = Expense;
