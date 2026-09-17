import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";
import validateEnv from "./config/validateEnv.js";
import mongoose from "mongoose";
dotenv.config({
        path: './.env' 

});
async function startServer() {
    try {
        validateEnv();
        await connectDB();
        const server = app.listen(process.env.PORT, () => {
            console.log(`Server is running on port: ${process.env.PORT}`);
        });
        server.on("error", (error) => {
            console.error("Server error:", error);
        });

        const shutdown = async (signal) => {
            console.log(`${signal} received. Shutting down server...`);
            await new Promise((resolve) => server.close(resolve));
            await mongoose.connection.close();
            process.exit(0);
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));

        process.on("unhandledRejection", (reason) => {
            console.error("Unhandled Rejection detected:", reason);
        });

        process.on("uncaughtException", async (error) => {
            console.error("Uncaught Exception detected:", error);
            await shutdown("uncaughtException");
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}
startServer();