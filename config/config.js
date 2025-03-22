import path from "path";
import { fileURLToPath } from "url";
import { config as dotConfig } from "dotenv";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file
if (process.env.NODE_ENV === "production") {
  dotConfig({ path: path.resolve(__dirname, ".env.production.local") });
} else {
  dotConfig({ path: path.resolve(__dirname, ".env.development.local") });
}

const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_DB_URI: process.env.MONGO_DB_URI,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIES_EXPIRES_IN: process.env.JWT_COOKIES_EXPIRES_IN,
};

export default config;
