import bcrypt from "bcryptjs";
import config from "../../config/config.js";

const createHash = async (password) => {
  return await bcrypt.hash(password, +config.SALT_ROUNDS);
};

const compareHash = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export { createHash, compareHash };
