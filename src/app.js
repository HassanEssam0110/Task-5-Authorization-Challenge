import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import bootstrap from "./modules/bootstrap.modules.js";
import config from "../config/config.js";
import { corsOptions } from "./utils/index.utils.js";

const app = express(); // create express app

/* Middleware */
if (config.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));

/**  Body Parsers & Cookies Middlewares */
app.use(express.json({ limit: "25kb" }));
app.use(cookieParser());

/* Router */
bootstrap(app);

export default app;
