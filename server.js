// @desc    Handle synchronous errors (uncaught exceptions)
process.on("uncaughtException", (error) => {
  console.error(`Error uncaughtException: 
    ErrorName: ${error.name} | ErrorMessage: ${error.message}`);
  process.exit(1);
});

import app from "./src/app.js";
import connectDB from "./src/database/db-connect.js";
import config from "./config/config.js";

connectDB(); // Connect to the database

const server = app.listen(config.PORT, () => {
  console.log(
    `Server is running on port: ${config.PORT} | Mode: ${config.NODE_ENV}`
  );
});

// Handle Unhandled Promise Rejections outside express ex: database
process.on("unhandledRejection", (error) => {
  console.error(
    `Unhandled Rejection at: ${new Date().toUTCString()}
    ErrorName: ${error.name} | ErrorMessage: ${error.message}`
  );
  // Gracefully close server
  if (server) {
    server.close(() => {
      console.error(`Shutting down...`);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
