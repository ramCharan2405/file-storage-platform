import "dotenv/config";
import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { Env } from "./config/env.config";
import { UnauthorizedException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";

const app = express();
const BASE_PATH = Env.BASE_PATH;
const allowedOrigins = Env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim());

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const errorMsg = `CORS policy: Origin ${origin} is not allowed. Allowed origins: ${allowedOrigins.join(", ")}`;
      callback(new UnauthorizedException(errorMsg), false);
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    res.json({ message: "Welcome to the API" });
  })
);

app.use(errorHandler);

async function startServer() {
  try {
    const server = app.listen(Env.PORT, () => {
      console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
    });

    const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];
    shutdownSignals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`Received ${signal}, shutting down gracefully...`);

        try {
          server.close(() => {
            console.log("Server closed successfully.");
            process.exit(0);
          });
        } catch (error) {
          console.error("Error occurred while closing server:", error);
          process.exit(1);
        }
      });
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();