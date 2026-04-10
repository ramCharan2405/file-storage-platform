import {Request, Response} from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { registerSchema } from "../validators/auth.validator";
import {HTTPSTATUS} from "../config/http.config";
import { registerService } from "../services/auth.service";
 

export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const body=registerSchema.parse(req.body);

    await registerService(body);
    return res.status(HTTPSTATUS.CREATED).json({
        message:"User registered successfully",
    })  

})