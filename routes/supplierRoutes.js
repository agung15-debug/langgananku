import express from 'express'
const router = express.Router()
import {
  getSuppliers,
  getSupplierById,
  deleteSupplier,
  createSupplier,
  updateSupplier,
} from '../controllers/supplierController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getSuppliers).post(protect, admin, createSupplier)
router
  .route('/:id')
  .get(getSupplierById)
  .delete(protect, admin, deleteSupplier)
  .put(protect, admin, updateSupplier)

export default router
