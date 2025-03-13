import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
});

pool.connect()
    .then(() => console.log("🟢 PostgreSQL Connected"))
    .catch((err) => console.error("🔴 PostgreSQL Connection Error", err));

export default pool;