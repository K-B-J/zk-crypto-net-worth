import express from "express"
import { login, createAccount } from "../controllers/authControllers.js"

const router = express.Router()

router.route("/").post(login)
router.route("/createaccount").post(createAccount)

export default router