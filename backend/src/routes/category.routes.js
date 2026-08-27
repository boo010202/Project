const express = require('express');
const router = express.Router();
const expenseCategoryController = require('../controllers/expenseCategory.controller');
const budgetCategoryController = require('../controllers/budgetCategory.controller');
const { isAuthenticated, restrictTo } = require('../middlewares/auth.middleware');

// Dispatch requests based on the request URL prefix (expense-categories vs budget-categories)
const dispatch = (methodName) => {
  return (req, res, next) => {
    const isExpense = req.baseUrl.includes('expense-categories');
    
    if (isExpense) {
      if (methodName === 'getAll') return expenseCategoryController.getAllCategories(req, res, next);
      if (methodName === 'create') return expenseCategoryController.createCategory(req, res, next);
      if (methodName === 'update') return expenseCategoryController.updateCategory(req, res, next);
      if (methodName === 'delete') return expenseCategoryController.deleteCategory(req, res, next);
    } else {
      if (methodName === 'getAll') return budgetCategoryController.getAllBudgets(req, res, next);
      if (methodName === 'create') return budgetCategoryController.createBudget(req, res, next);
      if (methodName === 'update') return budgetCategoryController.updateBudget(req, res, next);
      if (methodName === 'delete') return budgetCategoryController.deleteBudget(req, res, next);
    }
    
    return res.status(404).json({ message: 'Handler not found.' });
  };
};

router.get('/', isAuthenticated, dispatch('getAll'));
router.post('/', isAuthenticated, restrictTo('admin'), dispatch('create'));
router.put('/:id', isAuthenticated, restrictTo('admin'), dispatch('update'));
router.delete('/:id', isAuthenticated, restrictTo('admin'), dispatch('delete'));

module.exports = router;
