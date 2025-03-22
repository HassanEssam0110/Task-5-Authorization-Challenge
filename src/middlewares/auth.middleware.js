import { User } from "../database/models/index.models.js";
import { asyncHandler } from "./index.middlewares.js";
import { AppError, verifyToken } from "../utils/index.utils.js";
import { set } from "mongoose";

// ?==> Helpers
const validateToken = (token) => {
  try {
    const decoded = verifyToken(token);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        valid: false,
        expired: true,
        decoded: null,
        message: "Token expired.",
      };
    }
    return {
      valid: false,
      expired: false,
      decoded: null,
      message: "Invalid token.",
    };
  }
};

// ?==> Middleware

/**
 * @description  Middleware to authenticate users by validating JWT tokens.
 */
const authenticateUser = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token || req.header("Authorization");
  if (!token) return next(new AppError(401, "Unauthorized: No token found."));

  // Improved token extraction from "Bearer <token>"
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  // Validate token
  const { valid, decoded, message } = validateToken(token);
  if (!valid) return next(new AppError(401, `Unauthorized: ${message}`));

  // Check if user exists
  const user = await User.findById(decoded._id).populate("role");
  if (!user) return next(new AppError(401, "Unauthorized: User not found."));

  // Attach user to request
  req.user = user;
  next();
});

/**
 * Middleware to check if the user has the required role.
 * @param  {...string} allowedRoles - List of allowed roles.
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role.name)) {
      return next(new AppError(403, "Access Denied: No role assigned"));
    }
    next();
  };
};

/**
 * Middleware to check if the user has at least one required permission.
 * @param  {...string} allowedPermissions - List of required permissions.
 */
const authorizePermission = (...allowedPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user.role.permissions;
    // Check if the user has at least one required permission
    const hasPermission = userPermissions.some((perm) =>
      allowedPermissions.includes(perm)
    );

    if (!hasPermission) {
      return next(
        new AppError(403, "Access Denied: You don't have permission")
      );
    }
    next();
  };
};

export { authenticateUser, authorizeRole, authorizePermission };
