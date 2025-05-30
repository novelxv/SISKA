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

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://siska-production.up.railway.app", "https://siska-akademik.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/sk", skRoutes);
app.use("/api/dekan", dekanRoutes);
app.use("/api/dosen", dosenRoutes);
app.use("/api/excel", excelRoutes);

export default app;