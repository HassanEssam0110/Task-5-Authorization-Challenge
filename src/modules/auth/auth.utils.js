import { User, Role } from "../../database/models/index.models.js";
import { asyncHandler } from "../../middlewares/index.middlewares.js";
import { AppError, systemRoles } from "../../utils/index.utils.js";

// Cache variable to store the "Viewer" role after the first database query
let cachedViewerRole = null;

/**
 * Retrieves the "Viewer" role from the database.
 * If it's already cached, returns the cached role to avoid redundant database queries.
 *
 * @returns {Promise<Object|null>} The "Viewer" role document or null if not found.
 */
const getViewerRole = async () => {
  if (!cachedViewerRole) {
    cachedViewerRole = await Role.findOne({ name: systemRoles.Viewer });
  }
  return cachedViewerRole;
};

/**
 * Middleware to check if a user with the same username or email already exists.
 * Prevents duplicate user registrations.
 */
const checkDuplicateUser = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;
  let existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    const errorMessage =
      existingUser.username === username
        ? "Username already exists"
        : "Email already exists";

    return next(new AppError(409, errorMessage));
  }

  next();
});

/**
 * Middleware to assign the default "Viewer" role to a new user.
 * Ensures every new user has a role before proceeding.
 */
const addDefaultRole = asyncHandler(async (req, res, next) => {
  const viewerRole = await getViewerRole();
  if (!viewerRole) {
    return next(new AppError(404, "Default role 'Viewer' not found"));
  }
  req.body.role = viewerRole._id;
  next();
});

export { checkDuplicateUser, addDefaultRole };
