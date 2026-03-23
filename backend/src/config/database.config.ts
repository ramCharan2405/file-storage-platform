import mongoose from "mongoose";
import { Env } from "./env.config";
import { logger } from "../utils/logger";
const connectDatabase = async()=>{
    try {
        await mongoose.connect(Env.MONGO_URI)
        logger.info("Connected to MongoDB successfully.");
    } catch (error) {
        logger.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

const disconnectDatabase = async()=>{
    try {
        await mongoose.disconnect();
        logger.info("Disconnected from MongoDB successfully.");
    } catch (error) {
        logger.error("Error disconnecting from MongoDB:", error);
        process.exit(1);
    }
}

export {
    connectDatabase,
    disconnectDatabase
};