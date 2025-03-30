import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.routes";
import userRoutes from './routes/user.routes';
import skRoutes from "./routes/sk.routes";
import dekanRoutes from "./routes/dekan.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/sk", skRoutes);
app.use("/api/dekan", dekanRoutes);

export default app;