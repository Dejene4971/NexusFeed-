import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config({
        path: './.env' 

});
async function startServer() {
    try {
        await connectDB();
        app.on("error", (error) => {
            console.log("Error connecting to the database", error);
            throw error;
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port: ${process.env.PORT}`);
        });
    } catch (error) {
        console.log("Error connecting to the database", error);
    }
}
startServer();