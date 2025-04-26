import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


async function dbConnection() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed", error.message);
    }
}
export default dbConnection