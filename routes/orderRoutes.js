import express from 'express'
const router = express.Router()
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToConfirmPaid,
  updateOrderToDone,
  getMyOrders,
  getOrders,
  getSortOrders,
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/sortorders').get(protect, admin, getSortOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/confirmpay').put(protect, admin, updateOrderToConfirmPaid)
router.route('/:id/done').put(protect, admin, updateOrderToDone)

export default router
