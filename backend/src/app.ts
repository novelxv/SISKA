import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import skRoutes from "./routes/sk.routes"
import dekanRoutes from "./routes/dekan.routes"
import dosenRoutes from "./routes/dosen.routes"
import excelRoutes from "./routes/excel.routes"

dotenv.config()

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "https://siska-akademik.vercel.app",
  "https://siska-production.up.railway.app",
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        console.log(`CORS blocked origin: ${origin}`)
        callback(null, true)
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  }),
)

app.options("*", cors())

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  console.log("Origin:", req.headers.origin)
  next()
})

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")))

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/sk", skRoutes)
app.use("/api/dekan", dekanRoutes)
app.use("/api/dosen", dosenRoutes)
app.use("/api/excel", excelRoutes)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err)
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  })
})

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

export default app
