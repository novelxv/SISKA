import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.routes";
import userRoutes from './routes/user.routes';
import skRoutes from "./routes/sk.routes";
import dekanRoutes from "./routes/dekan.routes";
import dosenRoutes from "./routes/dosen.routes";
import excelRoutes from "./routes/excel.routes";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://siska-akademik.vercel.app",
  "https://siska-production.up.railway.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods"
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.options('*', cors());

app.use(express.json());

// Static and routes
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/sk", skRoutes);
app.use("/api/dekan", dekanRoutes);
app.use("/api/dosen", dosenRoutes);
app.use("/api/excel", excelRoutes);

export default app;