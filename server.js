import express from "express"
import morgan from "morgan"
import path from "path"
import zkcnwRoutes from "./routes/zkcnwRoutes.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()

const NODE_ENV = process.env.NODE_ENV || "development"

if (NODE_ENV === "development") {
    app.use(morgan("dev"))
}

app.use(express.json())

app.use("/api/", zkcnwRoutes)

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
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
)
