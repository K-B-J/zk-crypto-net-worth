import express from "express"
import { tester } from "../controllers/zkcnwControllers.js"

const router = express.Router()

router.route("/").get(tester)

export default router
