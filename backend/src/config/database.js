import mongoose from "mongoose";
const connectDB = async () => {
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error occurred:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected. Reconnecting...");
        });

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n Mongodb connected successfully !!!
            ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Mongodb connection failed !", error);
        throw error;
    }
};

export default connectDB;
