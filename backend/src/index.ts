import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
    console.log(`🌐 Server can be accessed externally at: http://103.107.4.28:${PORT}`);
});