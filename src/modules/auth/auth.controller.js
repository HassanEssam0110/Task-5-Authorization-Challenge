import config from "../../../config/config.js";
import { User } from "../../database/models/index.models.js";
import { asyncHandler } from "../../middlewares/index.middlewares.js";
import {
  AppError,
  compareHash,
  createToken,
  sanitizeUser,
} from "../../utils/index.utils.js";

/**
 * Sends a JSON response with a message and user data
 * @param {Response} res - Express response object
 * @param {{ withToken?: boolean, statusCode?: number, message?: string, user?: object }} options - Options object
 * @param {boolean} [options.withToken=false] - Whether to include a JSON Web Token in the response
 * @param {number} [options.statusCode=200] - HTTP status code to send with the response
 * @param {string} [options.message=""] - Optional message to include in the response
 * @param {object} [options.user={}] - Optional user data to include in the response
 * @returns {Response} - The Express response object
 */
const sendResponse = (
  res,
  { withToken = flase, statusCode = 200, message = "", user = {} }
) => {
  const responseData = {
    status: "success",
    data: { message, user: sanitizeUser(user) },
  };

  if (withToken) {
    const token = createToken({ _id: user._id, role: user.role });
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          parseInt(config.JWT_COOKIES_EXPIRES_IN) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true, // Prevents access to cookies via JavaScript (XSS protection)
      sameSite: "Strict", // Prevents CSRF attacks
      secure: config.NODE_ENV === "production", // Ensures cookies are sent over HTTPS in production
    };

    res.cookie("token", token, cookieOptions);
    responseData.data.token = token;
  }

  return res.status(statusCode).json(responseData);
};

// Signup
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;
  const user = await User.create({ username, email, password, role });

  sendResponse(res, {
    withToken: false,
    statusCode: 201,
    message: "Hurry! Now you are successfully registered. Please log in.",
    user,
  });
});

// Signin
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // First Check if the user exist in the database
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await compareHash(password, user?.password)))
    return next(new AppError(401, "Invalid credentials"));

  sendResponse(res, {
    withToken: true,
    statusCode: 200,
    message: "You are now logged in.",
    user,
  });
});

export { register, login };

/*
Should a Real-World App Send a Token on Registration?
In a real-world application, the best practice is not to send a token immediately after registration. Instead, users should be required to verify their email first before being able to log in.

✅ Best Practice:
User Registers → Store user in DB (without auto-login).
Send Email Verification Link with a token.
User Verifies Email → Then, they can log in and receive a token.
*/
