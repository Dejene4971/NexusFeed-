import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`, {
        });
        console.log(`\n Mongodb connected successfully !!!
            ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongodb connection failed !", error);
        process.exit(1);
        
    }
}

export default connectDB;
