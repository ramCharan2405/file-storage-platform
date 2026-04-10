import mongoose from "mongoose";
import { RegisterSchemaType } from "../validators/auth.validator"
import { AppError, UnauthorizedException } from "../utils/app-error";

import UserModel from "../models/user.model";
import StorageModel from "../models/storage.model";
import { logger } from "../utils/logger";

export const registerService=async (body: RegisterSchemaType)=>{
    const {email}=body;
    const session=await mongoose.startSession();

    try {
        await session.withTransaction(async()=>{
            const existingUser=await UserModel.findOne({email}).session(session);
            if(existingUser){
                throw new UnauthorizedException('User with this email already exists');
            }
            const newUser=new UserModel({
                ...body,
                profilePicture: body.profilePicture || null,
                
            });
            await newUser.save({session});
            const storage = new StorageModel({
                user: newUser._id,
                files: [],
            });
            await storage.save({session});
            return {user:newUser.omitPassword()};
        })
           
    } catch (error) {
        logger.error('Error during user registration', { error });
        throw error;
    } finally {
        await session.endSession();
    }
}