import { connect } from "mongoose";
import config from "../../config/config.js";

const connectDB = async () => {
  try {
    const conn = await connect(config.MONGO_DB_URI);
    console.log(
      `Database connected: ${conn.connection.host} - ${conn.connection.name}`
    );
  } catch (err) {
    console.log(`Database failed to connect: ${err.name} | ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
