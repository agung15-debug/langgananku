import express from 'express'
const router = express.Router()
import {
  getAnnounces,
  getAnnounceById,
  deleteAnnounce,
  createAnnounce,
  updateAnnounce,
  getBanners,
  createTextAnnounce,
  getTextAnnounce,
  deleteTextAnnounce,
} from '../controllers/announceController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/')
  .get(getAnnounces)
  .post(protect, admin, createAnnounce)
router.get('/banner', getBanners)
router.route('/textAnnounce')
  .get(getTextAnnounce)
  .post(protect, admin, createTextAnnounce)
  .delete(protect, admin, deleteTextAnnounce)
router
  .route('/:id')
  .get(getAnnounceById)
  .delete(protect, admin, deleteAnnounce)
  .put(protect, admin, updateAnnounce)

export default router
