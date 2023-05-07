import express from 'express'
const router = express.Router()
import {
  getExpenses,
  getExpenseById,
  deleteExpense,
  createExpense,
  updateExpense,
  getAllExpenses,
} from '../controllers/expenseController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getExpenses).post(protect, admin, createExpense)
router.get('/all', getAllExpenses);
router
  .route('/:id')
  .get(getExpenseById)
  .delete(protect, admin, deleteExpense)
  .put(protect, admin, updateExpense)

export default router
