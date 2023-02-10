import express from "express"
import {
    getPricesController,
    getQuantityController,
    setFeedsController,
} from "../controllers/dashboardControllers.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/price_coins").get(protect, getPricesController)
router.route("/quantity_coins").get(protect, getQuantityController)
router.route("/feeds").post(protect, admin, setFeedsController)

export default router
