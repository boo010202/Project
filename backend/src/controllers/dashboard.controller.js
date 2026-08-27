const Expense = require('../models/expense.model');
const ExpenseCategory = require('../models/expenseCategory.model');
const BudgetCategory = require('../models/budgetCategory.model');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

const getSummary = async (req, res, next) => {
  try {
    const requestedYear = req.query.year || new Date().getFullYear();
    const year = parseInt(requestedYear);

    // 1. Monthly totals for the requested year
    const monthlyData = await Expense.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('billing_month')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: {
        billing_month: {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`]
        }
      },
      group: [sequelize.fn('MONTH', sequelize.col('billing_month'))],
      raw: true
    });

    // Format monthly data to an array of 12 numbers (Jan to Dec)
    const monthlyChartData = Array(12).fill(0);
    monthlyData.forEach(item => {
      const monthIdx = parseInt(item.month) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        monthlyChartData[monthIdx] = parseFloat(item.total) || 0;
      }
    });

    // 2. Current Month vs Last Month calculations
    // Find the latest billing month in database or default to current date
    let latestMonthDate = new Date();
    const latestExpense = await Expense.findOne({
      order: [['billing_month', 'DESC']],
      attributes: ['billing_month']
    });

    if (latestExpense) {
      latestMonthDate = new Date(latestExpense.billing_month);
    }

    const currentYear = latestMonthDate.getFullYear();
    const currentMonthNum = latestMonthDate.getMonth() + 1; // 1-12

    // Get current month string
    const currentMonthStr = `${currentYear}-${String(currentMonthNum).padStart(2, '0')}-01`;
    
    // Calculate last month date
    let lastMonthYear = currentYear;
    let lastMonthNum = currentMonthNum - 1;
    if (lastMonthNum === 0) {
      lastMonthNum = 12;
      lastMonthYear = currentYear - 1;
    }
    const lastMonthStr = `${lastMonthYear}-${String(lastMonthNum).padStart(2, '0')}-01`;

    // Fetch sums
    const currentMonthSumResult = await Expense.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      where: { billing_month: currentMonthStr },
      raw: true
    });
    const currentMonthSum = parseFloat(currentMonthSumResult.total) || 0;

    const lastMonthSumResult = await Expense.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      where: { billing_month: lastMonthStr },
      raw: true
    });
    const lastMonthSum = parseFloat(lastMonthSumResult.total) || 0;

    // Calc percentage change
    let pctChange = 0;
    if (lastMonthSum > 0) {
      pctChange = ((currentMonthSum - lastMonthSum) / lastMonthSum) * 100;
    } else if (currentMonthSum > 0) {
      pctChange = 100; // 100% increase if last month was 0
    }

    // 3. Total for the current year
    const yearSumResult = await Expense.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      where: {
        billing_month: {
          [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`]
        }
      },
      raw: true
    });
    const yearSum = parseFloat(yearSumResult.total) || 0;

    res.json({
      success: true,
      data: {
        year,
        monthlyChartData,
        currentMonth: {
          month: currentMonthNum,
          year: currentYear,
          total: currentMonthSum
        },
        lastMonth: {
          month: lastMonthNum,
          year: lastMonthYear,
          total: lastMonthSum
        },
        pctChange: parseFloat(pctChange.toFixed(2)),
        yearTotal: yearSum
      }
    });
  } catch (error) {
    next(error);
  }
};

const getByCategory = async (req, res, next) => {
  try {
    const requestedYear = req.query.year || new Date().getFullYear();
    const year = parseInt(requestedYear);

    const data = await Expense.findAll({
      attributes: [
        'expense_category_id',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: {
        billing_month: {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`]
        }
      },
      include: [
        { model: ExpenseCategory, as: 'category', attributes: ['name', 'code'] }
      ],
      group: ['expense_category_id'],
      raw: true,
      nest: true
    });

    res.json({
      success: true,
      data: data.map(item => ({
        id: item.expense_category_id,
        name: item.category.name,
        code: item.category.code,
        total: parseFloat(item.total) || 0
      }))
    });
  } catch (error) {
    next(error);
  }
};

const getByBudget = async (req, res, next) => {
  try {
    const requestedYear = req.query.year || new Date().getFullYear();
    const year = parseInt(requestedYear);

    // Sum amount grouped by month and budget category to build a stacked bar chart
    const data = await Expense.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('billing_month')), 'month'],
        'budget_category_id',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: {
        billing_month: {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`]
        }
      },
      include: [
        { model: BudgetCategory, as: 'budget', attributes: ['name', 'code'] }
      ],
      group: [
        sequelize.fn('MONTH', sequelize.col('billing_month')),
        'budget_category_id'
      ],
      raw: true,
      nest: true
    });

    // Format for easier frontend consumption
    // We want lists of totals for each active budget category
    const budgets = await BudgetCategory.findAll({ attributes: ['id', 'name', 'code'] });
    
    // Construct response structure
    const monthlyBudgetTotals = budgets.map(b => {
      const chartArray = Array(12).fill(0);
      data.forEach(item => {
        if (item.budget_category_id === b.id) {
          const monthIdx = parseInt(item.month) - 1;
          if (monthIdx >= 0 && monthIdx < 12) {
            chartArray[monthIdx] = parseFloat(item.total) || 0;
          }
        }
      });
      
      return {
        id: b.id,
        name: b.name,
        code: b.code,
        data: chartArray
      };
    });

    res.json({
      success: true,
      data: monthlyBudgetTotals
    });
  } catch (error) {
    next(error);
  }
};

const getCompare = async (req, res, next) => {
  try {
    const { year1, year2 } = req.query;

    if (!year1 || !year2) {
      return res.status(400).json({ message: 'Both year1 and year2 are required.' });
    }

    const y1 = parseInt(year1);
    const y2 = parseInt(year2);

    const fetchYearData = async (year) => {
      const data = await Expense.findAll({
        attributes: [
          [sequelize.fn('MONTH', sequelize.col('billing_month')), 'month'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'total']
        ],
        where: {
          billing_month: {
            [Op.between]: [`${year}-01-01`, `${year}-12-31`]
          }
        },
        group: [sequelize.fn('MONTH', sequelize.col('billing_month'))],
        raw: true
      });

      const chartArray = Array(12).fill(0);
      data.forEach(item => {
        const monthIdx = parseInt(item.month) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
          chartArray[monthIdx] = parseFloat(item.total) || 0;
        }
      });
      return chartArray;
    };

    const year1Data = await fetchYearData(y1);
    const year2Data = await fetchYearData(y2);

    res.json({
      success: true,
      data: {
        year1: y1,
        year1Data,
        year2: y2,
        year2Data
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getByCategory,
  getByBudget,
  getCompare
};
