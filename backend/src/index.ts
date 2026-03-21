import "dotenv/config";
import express from "express";
import helment from "helmet";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import {Env} from "./config/env.config";
import { UnauthorizedException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHander.middleware";

const { app } = express();
const BASE_PATH=Env.BASE_PATH;
const allowedOrigins= Env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
        const errorMsg=`CORS policy: Origin ${origin} is not allowed. Allowed origins: ${allowedOrigins.join(', ')}`;
      callback(new UnauthorizedException(errorMsg), false);
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helment())

app.get("/", asyncHandler(async (req:Request, res:Response) => {
  res.json({ message: "Welcome to the API" });
}));
app.use(errorHandler);