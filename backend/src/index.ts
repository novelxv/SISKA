import express from "express";
import dotenv from "dotenv";
import pool from "./config/db";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("SISKA Backend is Running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

pool.query("SELECT NOW()", (err, res) => {
    if (err){
        console.error("Database connection error:", err);
    } else {
        console.log("Database connected at:", res.rows[0].now);
    }
});