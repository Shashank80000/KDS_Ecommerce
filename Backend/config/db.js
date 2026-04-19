import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        const mongoUri = (
            process.env.MONGO_URI || ""
        ).trim();

        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined. Check your .env file and dotenv configuration.");
        }

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log("MongoDB connected successfully")
    }
    catch(error){
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;