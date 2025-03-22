import config from "../../config/config.js";
import { AppError } from "./index.utils.js";

const whitelist = ["http://127.0.0.1:5500"];

const corsOptions = {
  origin: (origin, callback) => {
    if (
      whitelist.includes(origin) ||
      (config.NODE_ENV !== "production" && !origin)
    ) {
      return callback(null, true);
    }

    if (!origin) {
      return callback(new AppError(403, "Blocked: Missing origin"));
    }

    return callback(new AppError(403, "Blocked: Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export { corsOptions };
