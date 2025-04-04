import jwt from "jsonwebtoken";
import config from "../../config/config.js";

const createToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};

export { createToken, verifyToken };
