import express from "express"
import path from "path"
import authRoutes from "./routes/authRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import walletsRoutes from "./routes/walletsRoutes.js"
import requestsRoutes from "./routes/requestsRoutes.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()

const NODE_ENV = process.env.NODE_ENV || "development"

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/wallets", walletsRoutes)
app.use("/api/requests", requestsRoutes)

const __dirname = path.resolve()

if (NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")))
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    )
} else {
    app.get("/", (req, res) => {
        res.send("API is running...")
    })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`)
)
