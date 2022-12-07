import jwt from "jsonwebtoken"
import { JWT_KEY } from "../env.js"

const generateToken = (username, privateKey, isAdmin) => {
    return jwt.sign({ username, privateKey, isAdmin }, JWT_KEY, {
        expiresIn: "1d",
    })
}

export { generateToken, verifyToken }
