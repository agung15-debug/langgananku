import express from 'express'
const router = express.Router()
import {
  getBankAccounts,
  getBankAccountById,
  deleteBankAccount,
  createBankAccount,
  updateBankAccount,
  getAllBankAccounts,
} from '../controllers/bankAccountController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getBankAccounts).post(protect, admin, createBankAccount)
router.get('/all', getAllBankAccounts);
router
  .route('/:id')
  .get(getBankAccountById)
  .delete(protect, admin, deleteBankAccount)
  .put(protect, admin, updateBankAccount)

export default router
