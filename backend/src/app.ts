import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from './routes/user.routes';
import skRoutes from "./routes/sk.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/sk", skRoutes);

export default app;